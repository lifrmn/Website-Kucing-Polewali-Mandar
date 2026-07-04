import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { productUpdateSchema } from '@/lib/validations/product';
import { z } from 'zod';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produk tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: unknown) {
    console.error('GET product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data produk',
      },
      { status: 500 }
    );
  }
}

// PUT update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produk tidak ditemukan',
        },
        { status: 404 }
      );
    }

    // Validate input
    const validatedData = productUpdateSchema.parse({
      id,
      ...body,
      price: body.price ? Number(body.price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      low_stock_alert: body.low_stock_alert ? Number(body.low_stock_alert) : undefined,
    });

    // Check if slug already exists (excluding current product)
    if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingSlug) {
        return NextResponse.json(
          {
            success: false,
            error: 'Slug sudah digunakan',
          },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists (excluding current product)
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            error: 'SKU sudah digunakan',
          },
          { status: 400 }
        );
      }
    }

    const { id: _, ...updateData } = validatedData;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produk berhasil diperbarui',
    });
  } catch (error: unknown) {
    console.error('PUT product error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi gagal',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal memperbarui produk',
      },
      { status: 500 }
    );
  }
}

// DELETE product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Produk tidak ditemukan',
        },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error: unknown) {
    console.error('DELETE product error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus produk',
      },
      { status: 500 }
    );
  }
}
