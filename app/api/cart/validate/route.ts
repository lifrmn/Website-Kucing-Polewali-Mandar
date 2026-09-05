import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { reconcileCart, type CartSyncInput } from '@/services/cartService';

/**
 * Cart Validation API
 * Validates stock availability before checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartSyncInput[] } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { valid: false, errors: ['Cart is empty'] },
        { status: 400 }
      );
    }
    
    const result = await reconcileCart(prisma, items);
    
    return NextResponse.json({
      valid: result.valid,
      errors: [...result.errors, ...result.changes],
      warnings: result.changes,
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { valid: false, errors: ['Failed to validate cart'] },
      { status: 500 }
    );
  }
}
