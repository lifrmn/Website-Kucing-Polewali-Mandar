import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { getRequestIp } from '@/lib/audit';
import { boardingBookingUpdateSchema } from '@/lib/validations/booking';
import {
  BoardingBookingError,
  updateBoardingBooking,
} from '@/services/boardingBookingService';
import { BookingStatus } from '@/types/enums';

// GET single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('bookings:read');
    if (!authorization.authorized) return authorization.response;

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

// PATCH update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('bookings:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const input = boardingBookingUpdateSchema.parse(await request.json());
    const updatedBooking = await updateBoardingBooking(prisma, id, input, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Status booking berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PATCH booking error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Perubahan booking tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    if (error instanceof BoardingBookingError) {
      const status = error.code === 'BOOKING_NOT_FOUND' ? 404 : 409;
      const message = error.code === 'BOOKING_NOT_FOUND'
        ? 'Booking tidak ditemukan'
        : 'Perubahan status booking tidak diizinkan';
      return NextResponse.json({ success: false, error: message }, { status });
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate booking',
      },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;

// DELETE booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('bookings:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    
    await updateBoardingBooking(prisma, id, { status: BookingStatus.CANCELED }, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Booking berhasil dibatalkan',
    });
  } catch (error: unknown) {
    console.error('DELETE booking error:', error);
    if (error instanceof BoardingBookingError) {
      const status = error.code === 'BOOKING_NOT_FOUND' ? 404 : 409;
      return NextResponse.json(
        {
          success: false,
          error: error.code === 'BOOKING_NOT_FOUND'
            ? 'Booking tidak ditemukan'
            : 'Booking pada status ini tidak dapat dibatalkan',
        },
        { status }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus booking',
      },
      { status: 500 }
    );
  }
}
