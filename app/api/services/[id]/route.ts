import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Layanan tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error('GET service error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data layanan',
      },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, type, duration, price, is_active } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        type,
        duration: duration ? Number(duration) : null,
        price: Number(price),
        is_active,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Layanan berhasil diupdate',
    });
  } catch (error: any) {
    console.error('PUT service error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate layanan',
      },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Layanan berhasil dihapus',
    });
  } catch (error: any) {
    console.error('DELETE service error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus layanan',
      },
      { status: 500 }
    );
  }
}
