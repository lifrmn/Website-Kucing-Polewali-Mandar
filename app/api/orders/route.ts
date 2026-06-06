import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailService } from '@/services/emailService';

// GET all orders
export async function GET(request: NextRequest) {
  try {
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
  } catch (error: any) {
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
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      items,
      payment_method,
      notes,
    } = body;

    // Validation
    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data pelanggan dan item pesanan harus diisi',
        },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.unit_price * item.quantity);
    }, 0);

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const orderNumber = `INV-${year}${month}${day}-${random}`;

    // Create customer first
    const customer = await prisma.customer.create({
      data: {
        name: customer_name,
        phone: customer_phone,
        email: customer_email,
        address: customer_address,
      },
    });

    // Create order with items
    const order = await prisma.order.create({
      data: {
        order_number: orderNumber,
        customer_id: customer.id,
        subtotal: subtotal,
        total_amount: subtotal,
        payment_method: payment_method || 'qris',
        payment_status: 'pending',
        status: 'pending',
        notes: notes,
        orderItems: {
          create: items.map((item: any) => ({
            product_id: item.item_type === 'product' ? item.item_id : null,
            service_id: item.item_type === 'service' ? item.item_id : null,
            quantity: item.quantity,
            price: item.unit_price,
          })),
        },
      },
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

    // Send order confirmation email
    try {
      if (customer_email) {
        await emailService.sendOrderConfirmationEmail(
          customer_email,
          customer_name,
          orderNumber,
          items,
          subtotal
        );
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Pesanan berhasil dibuat',
    });
  } catch (error: any) {
    console.error('POST order error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat pesanan',
      },
      { status: 500 }
    );
  }
}
