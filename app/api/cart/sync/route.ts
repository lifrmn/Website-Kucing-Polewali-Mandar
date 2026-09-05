import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { reconcileCart } from '@/services/cartService';

const cartSyncSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['product', 'service']),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(100),
  }).strict()).min(1).max(50),
}).strict();

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
