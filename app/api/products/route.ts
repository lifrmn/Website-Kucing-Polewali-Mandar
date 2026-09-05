import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { productSchema } from '@/lib/validations/product';
import { toProductResponse } from '@/lib/product-response';
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

    if (all === 'true') {
      const authorization = await authorizeAdmin('products:manage');
      if (!authorization.authorized) return authorization.response;
    }

    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        include: {
          variants: {
            where: { is_active: true },
            orderBy: { created_at: 'asc' },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: products.map(toProductResponse),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
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
    const authorization = await authorizeAdmin('products:manage');
    if (!authorization.authorized) return authorization.response;

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

    const { variants, ...productData } = validatedData;
    const submittedSkus = [productData.sku, ...variants.map((variant) => variant.sku)];
    if (new Set(submittedSkus).size !== submittedSkus.length) {
      return NextResponse.json(
        { success: false, error: 'SKU produk dan varian harus unik' },
        { status: 400 }
      );
    }

    const [existingProductSku, existingVariantSku] = await Promise.all([
      prisma.product.findFirst({ where: { sku: { in: submittedSkus } } }),
      prisma.productVariant.findFirst({ where: { sku: { in: submittedSkus } } }),
    ]);
    if (existingProductSku || existingVariantSku) {
      return NextResponse.json(
        { success: false, error: 'SKU produk atau varian sudah digunakan' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map(({ id: _, attributes, ...variant }) => ({
            ...variant,
            attributes: JSON.stringify(attributes),
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json({
      success: true,
      data: toProductResponse(product),
      message: 'Produk berhasil ditambahkan',
    });
  } catch (error: unknown) {
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
        error: error instanceof Error ? error.message : 'Gagal menambahkan produk',
      },
      { status: 500 }
    );
  }
}
