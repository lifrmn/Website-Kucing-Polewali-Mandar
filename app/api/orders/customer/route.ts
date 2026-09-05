import { createHash } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { deleteImage, ImageValidationError, uploadImage, validateImageFile } from '@/lib/image-upload';
import prisma from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { customerOrderLookupSchema } from '@/lib/validations/customer-order';
import { findCustomerOrder } from '@/services/customerOrderService';
import { OrderStatus, PaymentStatus } from '@/types/enums';

const PAYMENT_PROOF_FOLDER = 'cikal-pet-care/payment-proofs';

function lookupKey(request: NextRequest, orderNumber: string, phone: string) {
  const digest = createHash('sha256').update(`${orderNumber}:${phone}`).digest('hex');
  return `customer-order:${getClientIp(request)}:${digest}`;
}

export async function POST(request: NextRequest) {
  try {
    const input = customerOrderLookupSchema.parse(await request.json());
    const limit = consumeRateLimit(lookupKey(request, input.order_number, input.customer_phone), 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const order = await findCustomerOrder(prisma, input);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak ditemukan atau nomor telepon tidak cocok' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Nomor pesanan atau telepon tidak valid' },
        { status: 422 }
      );
    }
    console.error('Customer order lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memeriksa pesanan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  let uploadedPublicId: string | null = null;
  try {
    const formData = await request.formData();
    const input = customerOrderLookupSchema.parse({
      order_number: formData.get('order_number'),
      customer_phone: formData.get('customer_phone'),
    });
    const limit = consumeRateLimit(`payment-proof:${lookupKey(request, input.order_number, input.customer_phone)}`, 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Batas upload bukti pembayaran tercapai. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const order = await findCustomerOrder(prisma, input);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak ditemukan atau nomor telepon tidak cocok' },
        { status: 404 }
      );
    }
    if ([OrderStatus.CANCELED, OrderStatus.COMPLETED, OrderStatus.REFUNDED].includes(order.status as OrderStatus)) {
      return NextResponse.json(
        { success: false, error: 'Status pesanan tidak menerima bukti pembayaran baru' },
        { status: 409 }
      );
    }

    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'File bukti pembayaran wajib diisi' },
        { status: 400 }
      );
    }

    const buffer = await validateImageFile(file);
    const uploaded = await uploadImage(buffer, PAYMENT_PROOF_FOLDER);
    uploadedPublicId = uploaded.public_id;

    const updated = await prisma.order.updateMany({
      where: {
        id: order.id,
        status: { notIn: [OrderStatus.CANCELED, OrderStatus.COMPLETED, OrderStatus.REFUNDED] },
      },
      data: {
        payment_proof_url: uploaded.secure_url,
        payment_status: PaymentStatus.VERIFYING,
        status: OrderStatus.WAITING_VERIFICATION,
      },
    });
    if (updated.count !== 1) {
      await deleteImage(uploaded.public_id);
      uploadedPublicId = null;
      return NextResponse.json(
        { success: false, error: 'Status pesanan berubah. Muat ulang sebelum mengunggah.' },
        { status: 409 }
      );
    }

    const refreshedOrder = await findCustomerOrder(prisma, input);
    return NextResponse.json({
      success: true,
      data: refreshedOrder,
      message: 'Bukti pembayaran berhasil dikirim untuk verifikasi',
    });
  } catch (error: unknown) {
    if (uploadedPublicId) {
      try {
        await deleteImage(uploadedPublicId);
      } catch (cleanupError) {
        console.error('Payment proof cleanup error:', cleanupError);
      }
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Nomor pesanan atau telepon tidak valid' },
        { status: 422 }
      );
    }
    if (error instanceof ImageValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error('Payment proof upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengunggah bukti pembayaran' },
      { status: 500 }
    );
  }
}
