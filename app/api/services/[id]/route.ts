import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { updateServiceSchema } from '@/lib/validations/service';

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('services:manage');
    if (!authorization.authorized) return authorization.response;

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
  } catch (error: unknown) {
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
    const authorization = await authorizeAdmin('services:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const input = updateServiceSchema.parse(await request.json());

    const service = await prisma.service.update({
      where: { id },
      data: input,
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Layanan berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PUT service error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data layanan tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
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
    const authorization = await authorizeAdmin('services:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    await prisma.service.update({
      where: { id },
      data: { is_active: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Layanan berhasil dinonaktifkan',
    });
  } catch (error: unknown) {
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
