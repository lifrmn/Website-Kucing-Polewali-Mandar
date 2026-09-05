import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { boardingBookingSchema } from '@/lib/validations/booking';
import {
  BoardingBookingError,
  createBoardingBooking,
} from '@/services/boardingBookingService';
import { emailService } from '@/services/emailService';

// GET all bookings
export async function GET(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('bookings:read');
    if (!authorization.authorized) return authorization.response;

    const { searchParams } = new URL(request.url);
    const bookingNumber = searchParams.get('bookingNumber');

    // If bookingNumber provided, get specific booking
    if (bookingNumber) {
      const booking = await prisma.penitipanBooking.findUnique({
        where: { booking_number: bookingNumber },
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
    }

    // Otherwise get all bookings
    const bookings = await prisma.penitipanBooking.findMany({
      include: {
        customer: true,
        package: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error: unknown) {
    console.error('GET bookings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data booking',
      },
      { status: 500 }
    );
  }
}

// POST create booking
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const limit = consumeRateLimit(`boarding-booking:${clientIp}`, 10, 15 * 60 * 1000);
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

    const input = boardingBookingSchema.parse(await request.json());
    const { booking, replayed } = await createBoardingBooking(prisma, input, idempotencyKey);
    if (!replayed) {
      await emailService.sendBookingConfirmationEmail({
        customerEmail: booking.customer.email,
        customerName: booking.customer.name,
        bookingLabel: booking.booking_number,
        schedule: `${input.check_in_date} sampai ${input.check_out_date}`,
        petName: booking.cat_name,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        booking_number: booking.booking_number,
        package_name: booking.package.name,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_nights: booking.total_nights,
        total_price: booking.total_price,
        status: booking.status,
      },
      message: replayed ? 'Booking sudah dibuat sebelumnya' : 'Booking berhasil dibuat',
    });
  } catch (error: unknown) {
    console.error('POST booking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data booking tidak valid', errors: error.issues },
        { status: 422 }
      );
    }

    const conflictMessages: Record<string, string> = {
      PACKAGE_UNAVAILABLE: 'Paket penitipan tidak tersedia',
      INVALID_DATE_RANGE: 'Tanggal check-out harus setelah check-in, maksimal 30 malam',
      PAST_CHECK_IN: 'Tanggal check-in tidak boleh di masa lalu',
      CAPACITY_FULL: 'Kapasitas penitipan penuh pada salah satu tanggal yang dipilih',
    };
    if (error instanceof BoardingBookingError) {
      return NextResponse.json(
        { success: false, error: conflictMessages[error.code] },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat booking',
      },
      { status: 500 }
    );
  }
}
