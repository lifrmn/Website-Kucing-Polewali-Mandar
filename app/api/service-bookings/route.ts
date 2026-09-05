import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { authorizeAdmin } from '@/lib/authorization';
import prisma from '@/lib/prisma';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { serviceBookingSchema } from '@/lib/validations/booking';
import {
  createServiceBooking,
  ServiceBookingError,
} from '@/services/serviceBookingService';
import { emailService } from '@/services/emailService';

export async function GET() {
  try {
    const authorization = await authorizeAdmin('bookings:read');
    if (!authorization.authorized) return authorization.response;

    const bookings = await prisma.serviceBooking.findMany({
      include: { customer: true, service: true },
      orderBy: [{ booking_date: 'asc' }, { booking_time: 'asc' }],
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: unknown) {
    console.error('GET service bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil booking layanan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const limit = consumeRateLimit(`service-booking:${clientIp}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaan booking. Silakan coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const idempotencyKey = request.headers.get('idempotency-key')?.trim();
    if (!idempotencyKey || idempotencyKey.length < 16 || idempotencyKey.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Idempotency-Key tidak valid' },
        { status: 400 }
      );
    }

    const input = serviceBookingSchema.parse(await request.json());
    const { booking, replayed } = await createServiceBooking(prisma, input, idempotencyKey);
    if (!replayed) {
      await emailService.sendBookingConfirmationEmail({
        customerEmail: booking.customer.email,
        customerName: booking.customer.name,
        bookingLabel: booking.service.name,
        schedule: `${input.booking_date} ${input.booking_time} WITA`,
        petName: booking.pet_name,
      });
    }
    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        service_name: booking.service.name,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status,
      },
      message: replayed ? 'Booking sudah dibuat sebelumnya' : 'Booking layanan berhasil dibuat',
    });
  } catch (error: unknown) {
    console.error('POST service booking error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data booking layanan tidak valid', errors: error.issues },
        { status: 422 }
      );
    }

    const conflictMessages: Record<string, string> = {
      SERVICE_UNAVAILABLE: 'Layanan tidak tersedia',
      PAST_BOOKING_SLOT: 'Tanggal dan jam booking tidak boleh di masa lalu',
      DAILY_LIMIT_REACHED: 'Kuota layanan pada tanggal tersebut sudah penuh',
    };
    if (error instanceof ServiceBookingError) {
      return NextResponse.json(
        { success: false, error: conflictMessages[error.code] },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Gagal membuat booking layanan' },
      { status: 500 }
    );
  }
}
