import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailService } from '@/services/emailService';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error: any) {
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
    const { id } = await params;
    const body = await request.json();
    const { payment_status, status } = body;

    const updateData: any = {};

    if (payment_status) {
      updateData.payment_status = payment_status;
      
      // If payment is paid, auto-confirm order
      if (payment_status === 'paid') {
        updateData.status = 'confirmed';
      }
    }

    if (status) {
      updateData.status = status;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    // Send email notification if payment is confirmed or order status changed
    try {
      if (payment_status === 'paid' && order.customer.email) {
        await emailService.sendPaymentConfirmationEmail(
          order.customer.email,
          order.customer.name,
          order.order_number,
          order.total_amount
        );
      } else if (status && order.customer.email) {
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
  } catch (error: any) {
    console.error('PUT order error:', error);
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
    const { id } = await params;
    const body = await request.json();
    const { payment_proof_url } = body;

    if (!payment_proof_url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL bukti pembayaran harus diisi',
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { payment_proof_url },
    });

    return NextResponse.json({
      success: true,
      data: payment_proof_url,
      message: 'Bukti pembayaran berhasil disimpan',
    });
  } catch (error: any) {
    console.error('PATCH payment proof error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan bukti pembayaran',
      },
      { status: 500 }
    );
  }
}
