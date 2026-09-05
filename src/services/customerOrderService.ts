import type { PrismaClient } from '@prisma/client';

import type { CustomerOrderLookupInput } from '@/lib/validations/customer-order';

export function findCustomerOrder(
  database: PrismaClient,
  input: CustomerOrderLookupInput
) {
  return database.order.findFirst({
    where: {
      order_number: input.order_number,
      customer: { phone: input.customer_phone },
    },
    select: {
      id: true,
      order_number: true,
      subtotal: true,
      shipping_cost: true,
      total_amount: true,
      payment_method: true,
      payment_status: true,
      status: true,
      payment_proof_url: true,
      tracking_number: true,
      shipped_at: true,
      completed_at: true,
      created_at: true,
      orderItems: {
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          price: true,
          subtotal: true,
        },
      },
    },
  });
}
