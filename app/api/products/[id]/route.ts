import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { productUpdateSchema } from '@/lib/validations/product';
import { toProductResponse } from '@/lib/product-response';
import { z } from 'zod';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const includeInactive = new URL(request.url).searchParams.get('all') === 'true';
    if (includeInactive) {
      const authorization = await authorizeAdmin('products:manage');
      if (!authorization.authorized) return authorization.response;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          where: { is_active: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!product || (!includeInactive && !product.is_active)) {
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
      data: toProductResponse(product),
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
    const authorization = await authorizeAdmin('products:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
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

    const { id: _, variants, ...updateData } = validatedData;
    const submittedSkus = [
      updateData.sku ?? existingProduct.sku,
      ...(variants?.map((variant) => variant.sku) ?? []),
    ];
    if (new Set(submittedSkus).size !== submittedSkus.length) {
      return NextResponse.json(
        { success: false, error: 'SKU produk dan varian harus unik' },
        { status: 400 }
      );
    }

    if (variants?.some((variant) => variant.id && !existingProduct.variants.some((item) => item.id === variant.id))) {
      return NextResponse.json(
        { success: false, error: 'Varian tidak dimiliki produk ini' },
        { status: 400 }
      );
    }

    const [productSkuConflict, variantSkuConflict] = await Promise.all([
      prisma.product.findFirst({
        where: { id: { not: id }, sku: { in: submittedSkus } },
      }),
      prisma.productVariant.findFirst({
        where: {
          sku: { in: submittedSkus },
          id: { notIn: variants?.flatMap((variant) => variant.id ? [variant.id] : []) ?? [] },
        },
      }),
    ]);
    if (productSkuConflict || variantSkuConflict) {
      return NextResponse.json(
        { success: false, error: 'SKU produk atau varian sudah digunakan' },
        { status: 409 }
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data: updateData });

      if (variants) {
        const retainedIds = variants.flatMap((variant) => variant.id ? [variant.id] : []);
        await tx.productVariant.updateMany({
          where: { product_id: id, id: { notIn: retainedIds } },
          data: { is_active: false },
        });

        for (const variant of variants) {
          const { id: variantId, attributes, ...variantData } = variant;
          const data = { ...variantData, attributes: JSON.stringify(attributes) };
          if (variantId) {
            await tx.productVariant.update({ where: { id: variantId }, data });
          } else {
            await tx.productVariant.create({ data: { ...data, product_id: id } });
          }
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: { variants: { where: { is_active: true }, orderBy: { created_at: 'asc' } } },
      });
    }, { isolationLevel: 'Serializable', timeout: 10_000 });

    return NextResponse.json({
      success: true,
      data: toProductResponse(product),
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
    const authorization = await authorizeAdmin('products:manage');
    if (!authorization.authorized) return authorization.response;

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

    await prisma.$transaction([
      prisma.product.update({ where: { id }, data: { is_active: false } }),
      prisma.productVariant.updateMany({ where: { product_id: id }, data: { is_active: false } }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dinonaktifkan',
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
