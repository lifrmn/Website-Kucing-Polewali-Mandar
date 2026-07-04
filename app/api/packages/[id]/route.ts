import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;
    const body = await request.json();
    const { name, description, price_per_night, features, max_cats, is_active } = body;

    // Convert features array to string if needed
    const featuresString = Array.isArray(features) 
      ? features.join(', ') 
      : features;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price_per_night !== undefined) updateData.price_per_night = parseFloat(price_per_night);
    if (featuresString !== undefined) updateData.features = featuresString;
    if (max_cats !== undefined) updateData.max_cats = parseInt(max_cats);
    if (is_active !== undefined) updateData.is_active = is_active;

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
    const { id } = await params;
    
    await prisma.penitipanPackage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Paket berhasil dihapus',
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
