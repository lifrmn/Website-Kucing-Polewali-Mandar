import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { authorizeAdmin } from '@/lib/authorization';
import { getRequestIp } from '@/lib/audit';
import prisma from '@/lib/prisma';
import { serviceBookingUpdateSchema } from '@/lib/validations/booking';
import {
  ServiceBookingError,
  updateServiceBooking,
} from '@/services/serviceBookingService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('bookings:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const input = serviceBookingUpdateSchema.parse(await request.json());
    const booking = await updateServiceBooking(prisma, id, input, {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Status booking layanan berhasil diperbarui',
    });
  } catch (error: unknown) {
    console.error('PATCH service booking error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Status booking tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    if (error instanceof ServiceBookingError) {
      return NextResponse.json(
        {
          success: false,
          error: error.code === 'BOOKING_NOT_FOUND'
            ? 'Booking layanan tidak ditemukan'
            : 'Perubahan status booking tidak diizinkan',
        },
        { status: error.code === 'BOOKING_NOT_FOUND' ? 404 : 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui booking layanan' },
      { status: 500 }
    );
  }
}