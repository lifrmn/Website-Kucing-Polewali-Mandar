import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { productSchema } from '@/lib/validations/product';
import { z } from 'zod';

// GET all products with search, filter, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all'); // For admin to see all including inactive

    const skip = (page - 1) * limit;
    const where: any = {};

    // Search by name, sku, or description
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    
    // Filter by category
    if (category && category !== 'ALL') {
      where.category = category;
    }
    
    // Filter featured
    if (featured === 'true') {
      where.featured = true;
    }

    // Only show active products for public, show all for admin
    if (all !== 'true') {
      where.is_active = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET products error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data produk',
      },
      { status: 500 }
    );
  }
}

// POST create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = productSchema.parse({
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      low_stock_alert: body.low_stock_alert ? Number(body.low_stock_alert) : 5,
    });

    // Check if slug already exists
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

    // Check if SKU already exists
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

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produk berhasil ditambahkan',
    });
  } catch (error: any) {
    console.error('POST product error:', error);

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
        error: error.message || 'Gagal menambahkan produk',
      },
      { status: 500 }
    );
  }
}
