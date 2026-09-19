import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { createPackageSchema } from '@/lib/validations/package';
import { parsePagination } from '@/lib/validations/pagination';
import { parsePetTypes, serializePetTypes } from '@/lib/pet-types';

// GET all penitipan packages
export async function GET(request: NextRequest) {
  try {
    const pagination = parsePagination(new URL(request.url).searchParams);
    const where = { is_active: true };
    const [packages, total] = await prisma.$transaction([
      prisma.penitipanPackage.findMany({
        where,
        orderBy: { price_per_night: 'asc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.penitipanPackage.count({ where }),
    ]);

    // Parse features JSON string to array
    const packagesWithFeatures = packages.map((pkg) => ({
      ...pkg,
      accepted_pet_types: parsePetTypes(pkg.accepted_pet_types),
      features: typeof pkg.features === 'string' 
        ? pkg.features.split(',').map(f => f.trim()) 
        : pkg.features,
    }));

    return NextResponse.json({
      success: true,
      data: packagesWithFeatures,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: unknown) {
    console.error('GET packages error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Parameter pagination tidak valid' },
        { status: 422 }
      );
    }
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
    const authorization = await authorizeAdmin('packages:manage', request);
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
        max_pets: input.max_pets,
        accepted_pet_types: serializePetTypes(input.accepted_pet_types),
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
