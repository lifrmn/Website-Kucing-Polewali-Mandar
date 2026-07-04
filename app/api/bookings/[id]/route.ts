import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.penitipanBooking.findUnique({
      where: { id },
      include: {
        customer: true,
        package: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: unknown) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data booking',
      },
      { status: 500 }
    );
  }
}

// PUT update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status harus diisi',
        },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.penitipanBooking.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        package: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Status booking berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PUT booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate booking',
      },
      { status: 500 }
    );
  }
}

// DELETE booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.penitipanBooking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking berhasil dihapus',
    });
  } catch (error: unknown) {
    console.error('DELETE booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus booking',
      },
      { status: 500 }
    );
  }
}
