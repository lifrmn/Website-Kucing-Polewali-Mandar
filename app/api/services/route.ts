import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    
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
  } catch (error: any) {
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
    const body = await request.json();
    const { name, description, type, duration, price } = body;

    // Validation
    if (!name || !type || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nama, tipe, dan harga harus diisi',
        },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        type,
        duration: duration ? Number(duration) : null,
        price: Number(price),
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Layanan berhasil ditambahkan',
    });
  } catch (error: any) {
    console.error('POST service error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menambahkan layanan',
      },
      { status: 500 }
    );
  }
}
