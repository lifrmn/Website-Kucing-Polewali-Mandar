import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { createServiceSchema } from '@/lib/validations/service';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { is_active: true };
    
    if (type) {
      where.type = type;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error: unknown) {
    console.error('GET services error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data layanan',
      },
      { status: 500 }
    );
  }
}

// POST create service
export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('services:manage');
    if (!authorization.authorized) return authorization.response;

    const input = createServiceSchema.parse(await request.json());

    // Generate slug from name
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const service = await prisma.service.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        type: input.type,
        duration: input.duration,
        price: input.price,
        max_bookings_per_day: input.max_bookings_per_day,
        is_active: input.is_active ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Layanan berhasil ditambahkan',
    });
  } catch (error: unknown) {
    console.error('POST service error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data layanan tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menambahkan layanan',
      },
      { status: 500 }
    );
  }
}
