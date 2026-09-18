import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { cartSyncSchema } from '@/lib/validations/cart';
import { reconcileCart } from '@/services/cartService';

/**
 * Cart Sync API
 * Syncs cart with server for logged-in users (future implementation)
 */
export async function POST(request: NextRequest) {
  try {
    const input = cartSyncSchema.parse(await request.json());
    const result = await reconcileCart(prisma, input.items);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data keranjang tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    console.error('Cart sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyinkronkan keranjang' },
      { status: 500 }
    );
  }
}
