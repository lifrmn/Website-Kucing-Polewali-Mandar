import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all penitipan packages
export async function GET(_request: NextRequest) {
  try {
    const packages = await prisma.penitipanPackage.findMany({
      where: { is_active: true },
      orderBy: { price_per_night: 'asc' },
    });

    // Parse features JSON string to array
    const packagesWithFeatures = packages.map((pkg) => ({
      ...pkg,
      features: typeof pkg.features === 'string' 
        ? pkg.features.split(',').map(f => f.trim()) 
        : pkg.features,
    }));

    return NextResponse.json({
      success: true,
      data: packagesWithFeatures,
    });
  } catch (error: unknown) {
    console.error('GET packages error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data paket penitipan',
      },
      { status: 500 }
    );
  }
}

// POST create package (for admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price_per_night, features, max_cats } = body;

    // Validation
    if (!name || !price_per_night) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nama dan harga per malam harus diisi',
        },
        { status: 400 }
      );
    }

    // Convert features array to string if needed
    const featuresString = Array.isArray(features) 
      ? features.join(', ') 
      : features;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPackage = await prisma.penitipanPackage.create({
      data: {
        name,
        slug,
        description,
        price_per_night: parseFloat(price_per_night),
        features: featuresString,
        max_cats: parseInt(max_cats) || 1,
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Paket penitipan berhasil dibuat',
    });
  } catch (error: unknown) {
    console.error('POST package error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat paket penitipan',
      },
      { status: 500 }
    );
  }
}
