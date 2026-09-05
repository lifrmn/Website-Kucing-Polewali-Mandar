import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailService } from '@/services/emailService';
import {
  OrderManagementError,
  updateManagedPaymentProof,
  updateManagedOrder,
} from '@/services/orderManagementService';
import { authorizeAdmin } from '@/lib/authorization';
import {
  orderUpdateSchema,
  paymentProofUpdateSchema,
} from '@/lib/validations/order-management';
import { PaymentStatus } from '@/types/enums';
import { z } from 'zod';
import { getRequestIp } from '@/lib/audit';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('orders:read');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
            service: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pesanan tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: unknown) {
    console.error('GET order error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data pesanan',
      },
      { status: 500 }
    );
  }
}

// PUT update order (status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('orders:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const body = orderUpdateSchema.parse(await request.json());
    const order = await updateManagedOrder(prisma, id, body, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    // Send email notification if payment is confirmed or order status changed
    try {
      if (body.payment_status === PaymentStatus.PAID && order.customer.email) {
        await emailService.sendPaymentConfirmationEmail(
          order.customer.email,
          order.customer.name,
          order.order_number,
          order.total_amount
        );
      } else if (body.status && order.customer.email) {
        await emailService.sendOrderStatusUpdateEmail(
          order.customer.email,
          order.customer.name,
          order.order_number,
          order.status,
          order.total_amount
        );
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: `Status berhasil diubah`,
    });
  } catch (error: unknown) {
    console.error('PUT order error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Perubahan pesanan tidak valid', errors: error.issues },
        { status: 422 }
      );
    }

    if (error instanceof OrderManagementError) {
      const messages: Record<OrderManagementError['code'], string> = {
        ORDER_NOT_FOUND: 'Pesanan tidak ditemukan',
        CANCELED_ORDER_IS_FINAL: 'Pesanan yang dibatalkan tidak dapat dibuka kembali',
      };
      return NextResponse.json(
        { success: false, error: messages[error.code] },
        { status: error.code === 'ORDER_NOT_FOUND' ? 404 : 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate pesanan',
      },
      { status: 500 }
    );
  }
}

// PATCH update payment proof
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('orders:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const { payment_proof_url } = paymentProofUpdateSchema.parse(await request.json());
    await updateManagedPaymentProof(prisma, id, payment_proof_url, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    return NextResponse.json({
      success: true,
      data: payment_proof_url,
      message: 'Bukti pembayaran berhasil disimpan',
    });
  } catch (error: unknown) {
    console.error('PATCH payment proof error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'URL bukti pembayaran tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    if (error instanceof OrderManagementError && error.code === 'ORDER_NOT_FOUND') {
      return NextResponse.json(
        { success: false, error: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan bukti pembayaran',
      },
      { status: 500 }
    );
  }
}
