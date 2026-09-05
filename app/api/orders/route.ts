import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailService } from '@/services/emailService';
import { CheckoutConflictError, createCheckout } from '@/services/checkoutService';
import { authorizeAdmin } from '@/lib/authorization';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { checkoutSchema } from '@/lib/validations/order';
import { z } from 'zod';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('orders:read');
    if (!authorization.authorized) return authorization.response;

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    // If orderNumber provided, get specific order
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { order_number: orderNumber },
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
    }

    // Otherwise get all orders
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
            service: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Transform orders to include customer details at root level
    const transformedOrders = orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      order_type: 'product',
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.status,
      created_at: order.created_at,
      items: order.orderItems,
    }));

    return NextResponse.json({
      success: true,
      data: {
        data: transformedOrders,
        total: transformedOrders.length,
      },
    });
  } catch (error: unknown) {
    console.error('GET orders error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data pesanan',
      },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const checkoutLimit = consumeRateLimit(`checkout:${clientIp}`, 10, 15 * 60 * 1000);
    if (!checkoutLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaan checkout. Silakan coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(checkoutLimit.retryAfterSeconds) } }
      );
    }

    const body = checkoutSchema.parse(await request.json());
    const idempotencyKey = request.headers.get('idempotency-key')?.trim();
    if (!idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Idempotency-Key tidak valid' },
        { status: 400 }
      );
    }

    const { order, replayed } = await createCheckout(prisma, body, idempotencyKey);

    // Send order confirmation email
    try {
      if (!replayed && body.customer_email) {
        await emailService.sendOrderConfirmationEmail(
          body.customer_email,
          body.customer_name,
          order.order_number,
          order.orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
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
      message: replayed ? 'Pesanan sudah dibuat sebelumnya' : 'Pesanan berhasil dibuat',
    });
  } catch (error: unknown) {
    console.error('POST order error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data checkout tidak valid', errors: error.issues },
        { status: 422 }
      );
    }

    const conflictMessages: Record<string, string> = {
      PRODUCT_UNAVAILABLE: 'Produk tidak tersedia',
      VARIANT_REQUIRED: 'Pilih varian produk yang tersedia',
      VARIANT_UNAVAILABLE: 'Varian produk tidak tersedia',
      SERVICE_UNAVAILABLE: 'Layanan tidak tersedia',
      INSUFFICIENT_STOCK: 'Stok tidak mencukupi',
      INVALID_SERVICE_VARIANT: 'Varian tidak valid untuk layanan',
    };
    if (error instanceof CheckoutConflictError) {
      return NextResponse.json(
        { success: false, error: conflictMessages[error.code] },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat pesanan',
      },
      { status: 500 }
    );
  }
}
