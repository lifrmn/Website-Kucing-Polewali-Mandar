import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { CartItem } from '@/types';

/**
 * Cart Validation API
 * Validates stock availability before checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { valid: false, errors: ['Cart is empty'] },
        { status: 400 }
      );
    }
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate each cart item
    for (const item of items) {
      if (item.type === 'product') {
        // Check product or variant stock
        if (item.variantId) {
          // Validate variant stock
          const variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });
          
          if (!variant) {
            errors.push(`Variant "${item.variantName}" not found`);
            continue;
          }
          
          if (!variant.is_active || !variant.product.is_active) {
            errors.push(`${item.name} (${item.variantName}) is no longer available`);
            continue;
          }
          
          if (variant.stock < item.quantity) {
            errors.push(
              `${item.name} (${item.variantName}): Only ${variant.stock} available, you requested ${item.quantity}`
            );
          } else if (variant.stock < 5) {
            warnings.push(
              `${item.name} (${item.variantName}): Low stock (${variant.stock} remaining)`
            );
          }
        } else {
          // Validate base product stock
          const product = await prisma.product.findUnique({
            where: { id: item.id },
          });
          
          if (!product) {
            errors.push(`Product "${item.name}" not found`);
            continue;
          }
          
          if (!product.is_active) {
            errors.push(`${item.name} is no longer available`);
            continue;
          }
          
          if (product.stock < item.quantity) {
            errors.push(
              `${item.name}: Only ${product.stock} available, you requested ${item.quantity}`
            );
          } else if (product.stock < 5) {
            warnings.push(
              `${item.name}: Low stock (${product.stock} remaining)`
            );
          }
        }
      } else if (item.type === 'service') {
        // Validate service availability
        const service = await prisma.service.findUnique({
          where: { id: item.id },
        });
        
        if (!service) {
          errors.push(`Service "${item.name}" not found`);
          continue;
        }
        
        if (!service.is_active) {
          errors.push(`${item.name} is no longer available`);
        }
      }
    }
    
    const valid = errors.length === 0;
    
    return NextResponse.json({
      valid,
      errors,
      warnings,
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { valid: false, errors: ['Failed to validate cart'] },
      { status: 500 }
    );
  }
}
