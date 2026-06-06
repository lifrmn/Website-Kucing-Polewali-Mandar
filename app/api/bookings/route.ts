import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all bookings
export async function GET(request: NextRequest) {
  try {
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
  } catch (error: any) {
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
    const body = await request.json();
    const {
      package_id,
      customer_name,
      customer_phone,
      customer_email,
      cat_name,
      cat_age,
      cat_gender,
      cat_health_condition,
      check_in_date,
      check_out_date,
      special_requests,
    } = body;

    // Validation
    if (!package_id || !customer_name || !customer_phone || !cat_name || !check_in_date || !check_out_date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data pelanggan, kucing, dan tanggal check-in/out harus diisi',
        },
        { status: 400 }
      );
    }

    // Get package to calculate price
    const pkg = await prisma.penitipanPackage.findUnique({
      where: { id: package_id },
    });

    if (!pkg) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paket tidak ditemukan',
        },
        { status: 404 }
      );
    }

    // Calculate total nights
    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalNights <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tanggal check-out harus setelah tanggal check-in',
        },
        { status: 400 }
      );
    }

    const totalPrice = pkg.price_per_night * totalNights;

    // Generate booking number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const bookingNumber = `BOK-${year}${month}${day}-${random}`;

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: { phone: customer_phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customer_name,
          phone: customer_phone,
          email: customer_email,
        },
      });
    }

    // Create booking
    const booking = await prisma.penitipanBooking.create({
      data: {
        booking_number: bookingNumber,
        customer_id: customer.id,
        package_id,
        cat_name,
        cat_age,
        cat_gender,
        cat_health_condition,
        check_in_date,
        check_out_date,
        total_nights: totalNights,
        total_price: totalPrice,
        status: 'pending',
        special_requests,
      },
      include: {
        customer: true,
        package: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking berhasil dibuat',
    });
  } catch (error: any) {
    console.error('POST booking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat booking',
      },
      { status: 500 }
    );
  }
}
