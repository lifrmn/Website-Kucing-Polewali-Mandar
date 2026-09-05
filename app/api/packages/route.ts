import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { createPackageSchema } from '@/lib/validations/package';

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
    const authorization = await authorizeAdmin('packages:manage');
    if (!authorization.authorized) return authorization.response;

    const input = createPackageSchema.parse(await request.json());

    // Convert features array to string if needed
    const featuresString = Array.isArray(input.features)
      ? input.features.join(', ')
      : input.features;

    // Generate slug from name
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPackage = await prisma.penitipanPackage.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        price_per_night: input.price_per_night,
        features: featuresString,
        max_cats: input.max_cats,
        is_active: input.is_active ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Paket penitipan berhasil dibuat',
    });
  } catch (error: unknown) {
    console.error('POST package error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data paket tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal membuat paket penitipan',
      },
      { status: 500 }
    );
  }
}
