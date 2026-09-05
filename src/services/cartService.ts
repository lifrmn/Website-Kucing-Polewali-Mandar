import type { PrismaClient } from '@prisma/client';

export interface CartSyncInput {
  id: string;
  type: 'product' | 'service';
  variantId?: string;
  quantity: number;
}

export interface SyncedCartItem extends CartSyncInput {
  name: string;
  price: number;
  image_url: string | null;
  stock?: number;
  sku?: string;
  variantName?: string;
  variantAttributes?: Record<string, string>;
}

function parseVariantAttributes(value: string): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
  } catch {
    return {};
  }
}

export async function reconcileCart(database: PrismaClient, inputs: CartSyncInput[]) {
  const items: SyncedCartItem[] = [];
  const changes: string[] = [];
  const errors: string[] = [];

  for (const input of inputs) {
    if (input.type === 'service') {
      const service = await database.service.findFirst({
        where: { id: input.id, is_active: true },
      });
      if (!service) {
        errors.push('Layanan dalam keranjang sudah tidak tersedia');
        continue;
      }
      items.push({
        ...input,
        quantity: 1,
        name: service.name,
        price: service.price,
        image_url: service.image_url,
      });
      if (input.quantity !== 1) changes.push(`Jumlah ${service.name} disesuaikan menjadi 1`);
      continue;
    }

    const product = await database.product.findFirst({
      where: { id: input.id, is_active: true },
      include: { variants: { where: { is_active: true } } },
    });
    if (!product) {
      errors.push('Produk dalam keranjang sudah tidak tersedia');
      continue;
    }

    if (input.variantId) {
      const variant = product.variants.find((entry) => entry.id === input.variantId);
      if (!variant) {
        errors.push(`${product.name}: varian sudah tidak tersedia`);
        continue;
      }
      if (variant.stock < 1) {
        errors.push(`${product.name} (${variant.name}) sedang habis`);
        continue;
      }
      const quantity = Math.min(input.quantity, variant.stock);
      if (quantity !== input.quantity) {
        changes.push(`${product.name} (${variant.name}) disesuaikan menjadi ${quantity}`);
      }
      items.push({
        ...input,
        quantity,
        name: product.name,
        price: variant.price ?? product.price,
        image_url: product.image_url,
        stock: variant.stock,
        sku: variant.sku,
        variantName: variant.name,
        variantAttributes: parseVariantAttributes(variant.attributes),
      });
      continue;
    }

    if (product.variants.length > 0) {
      errors.push(`${product.name}: pilih varian yang tersedia`);
      continue;
    }
    if (product.stock < 1) {
      errors.push(`${product.name} sedang habis`);
      continue;
    }
    const quantity = Math.min(input.quantity, product.stock);
    if (quantity !== input.quantity) changes.push(`${product.name} disesuaikan menjadi ${quantity}`);
    items.push({
      ...input,
      quantity,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      sku: product.sku,
    });
  }

  return { valid: errors.length === 0 && changes.length === 0, items, changes, errors };
}