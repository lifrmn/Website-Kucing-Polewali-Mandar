import { Prisma, PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';

import { calculateShipping, CheckoutInput, normalizePaymentMethod } from '@/lib/validations/order';
import { OrderStatus, PaymentStatus } from '@/types/enums';

export type CheckoutConflictCode =
  | 'PRODUCT_UNAVAILABLE'
  | 'VARIANT_REQUIRED'
  | 'VARIANT_UNAVAILABLE'
  | 'SERVICE_UNAVAILABLE'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_SERVICE_VARIANT';

export class CheckoutConflictError extends Error {
  constructor(public readonly code: CheckoutConflictCode) {
    super(code);
    this.name = 'CheckoutConflictError';
  }
}

type CheckoutOrder = Prisma.OrderGetPayload<{
  include: { customer: true; orderItems: true };
}>;

export interface CheckoutResult {
  order: CheckoutOrder;
  replayed: boolean;
}

export async function createCheckout(
  database: PrismaClient,
  body: CheckoutInput,
  idempotencyKey: string
): Promise<CheckoutResult> {
  const existingOrder = await database.order.findUnique({
    where: { idempotency_key: idempotencyKey },
    include: { customer: true, orderItems: true },
  });
  if (existingOrder) return { order: existingOrder, replayed: true };

  const groupedItems = Array.from(
    body.items.reduce((groups, item) => {
      const key = `${item.item_type}:${item.item_id}:${item.variant_id || ''}`;
      const existing = groups.get(key);
      groups.set(key, existing ? { ...existing, quantity: existing.quantity + item.quantity } : item);
      return groups;
    }, new Map<string, (typeof body.items)[number]>()).values()
  );

  if (groupedItems.some((item) => item.quantity > 100)) {
    throw new CheckoutConflictError('INSUFFICIENT_STOCK');
  }

  try {
    const order = await database.$transaction(async (tx) => {
      const resolvedItems: Array<{
        product_id: string | null;
        variant_id: string | null;
        service_id: string | null;
        name: string;
        sku: string | null;
        quantity: number;
        price: number;
        subtotal: number;
      }> = [];

      for (const item of groupedItems) {
        if (item.item_type === 'product') {
          const product = await tx.product.findFirst({
            where: { id: item.item_id, is_active: true },
            include: {
              _count: { select: { variants: { where: { is_active: true } } } },
            },
          });
          if (!product) throw new CheckoutConflictError('PRODUCT_UNAVAILABLE');

          if (item.variant_id) {
            const variant = await tx.productVariant.findFirst({
              where: { id: item.variant_id, product_id: product.id, is_active: true },
            });
            if (!variant) throw new CheckoutConflictError('VARIANT_UNAVAILABLE');

            const stockUpdate = await tx.productVariant.updateMany({
              where: { id: variant.id, is_active: true, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (stockUpdate.count !== 1) throw new CheckoutConflictError('INSUFFICIENT_STOCK');

            const price = variant.price ?? product.price;
            resolvedItems.push({
              product_id: product.id,
              variant_id: variant.id,
              service_id: null,
              name: `${product.name} - ${variant.name}`,
              sku: variant.sku,
              quantity: item.quantity,
              price,
              subtotal: price * item.quantity,
            });
          } else {
            if (product._count.variants > 0) {
              throw new CheckoutConflictError('VARIANT_REQUIRED');
            }

            const stockUpdate = await tx.product.updateMany({
              where: { id: product.id, is_active: true, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (stockUpdate.count !== 1) throw new CheckoutConflictError('INSUFFICIENT_STOCK');

            resolvedItems.push({
              product_id: product.id,
              variant_id: null,
              service_id: null,
              name: product.name,
              sku: product.sku,
              quantity: item.quantity,
              price: product.price,
              subtotal: product.price * item.quantity,
            });
          }
        } else {
          if (item.variant_id) throw new CheckoutConflictError('INVALID_SERVICE_VARIANT');
          const service = await tx.service.findFirst({
            where: { id: item.item_id, is_active: true },
          });
          if (!service) throw new CheckoutConflictError('SERVICE_UNAVAILABLE');

          resolvedItems.push({
            product_id: null,
            variant_id: null,
            service_id: service.id,
            name: service.name,
            sku: null,
            quantity: item.quantity,
            price: service.price,
            subtotal: service.price * item.quantity,
          });
        }
      }

      const subtotal = resolvedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const shippingCost = calculateShipping(subtotal);
      const totalAmount = subtotal + shippingCost;
      const phone = body.customer_phone.replace(/\s+/g, '');
      const customer = await tx.customer.upsert({
        where: { phone },
        update: {
          name: body.customer_name,
          email: body.customer_email || null,
          address: body.customer_address,
          total_orders: { increment: 1 },
          total_spent: { increment: totalAmount },
        },
        create: {
          name: body.customer_name,
          phone,
          email: body.customer_email || null,
          address: body.customer_address,
          total_orders: 1,
          total_spent: totalAmount,
        },
      });

      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const orderNumber = `INV-${datePart}-${randomBytes(6).toString('hex').toUpperCase()}`;

      return tx.order.create({
        data: {
          order_number: orderNumber,
          idempotency_key: idempotencyKey,
          customer_id: customer.id,
          subtotal,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          payment_method: normalizePaymentMethod(body.payment_method),
          payment_status: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          shipping_address: body.customer_address,
          notes: body.notes,
          orderItems: { create: resolvedItems },
        },
        include: { customer: true, orderItems: true },
      });
    }, { isolationLevel: 'Serializable', timeout: 10_000 });

    return { order, replayed: false };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const replayedOrder = await database.order.findUnique({
        where: { idempotency_key: idempotencyKey },
        include: { customer: true, orderItems: true },
      });
      if (replayedOrder) return { order: replayedOrder, replayed: true };
    }
    throw error;
  }
}
