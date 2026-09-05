import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { updatePackageSchema } from '@/lib/validations/package';

// GET single package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('packages:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const pkg = await prisma.penitipanPackage.findUnique({
      where: { id },
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

    // Parse features
    const packageWithFeatures = {
      ...pkg,
      features: typeof pkg.features === 'string' 
        ? pkg.features.split(',').map(f => f.trim()) 
        : pkg.features,
    };

    return NextResponse.json({
      success: true,
      data: packageWithFeatures,
    });
  } catch (error: unknown) {
    console.error('GET package error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data paket',
      },
      { status: 500 }
    );
  }
}

// PUT update package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('packages:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const input = updatePackageSchema.parse(await request.json());

    // Convert features array to string if needed
    const featuresString = Array.isArray(input.features)
      ? input.features.join(', ')
      : input.features;

    const updateData = { ...input, features: featuresString };

    const updatedPackage = await prisma.penitipanPackage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Paket berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PUT package error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data paket tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate paket',
      },
      { status: 500 }
    );
  }
}

// DELETE package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('packages:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    
    await prisma.penitipanPackage.update({
      where: { id },
      data: { is_active: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Paket berhasil dinonaktifkan',
    });
  } catch (error: unknown) {
    console.error('DELETE package error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus paket',
      },
      { status: 500 }
    );
  }
}
