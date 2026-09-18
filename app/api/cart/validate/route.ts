import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { cartSyncSchema } from '@/lib/validations/cart';
import { reconcileCart } from '@/services/cartService';

/**
 * Cart Validation API
 * Validates stock availability before checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { items } = cartSyncSchema.parse(await request.json());
    
    const result = await reconcileCart(prisma, items);
    
    return NextResponse.json({
      valid: result.valid,
      errors: [...result.errors, ...result.changes],
      warnings: result.changes,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, errors: ['Data keranjang tidak valid'] },
        { status: 422 }
      );
    }
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { valid: false, errors: ['Failed to validate cart'] },
      { status: 500 }
    );
  }
}
