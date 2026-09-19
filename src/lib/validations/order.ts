import { z } from 'zod';

import { PaymentMethod } from '@/types/enums';
import { DELIVERY_AREAS, FULFILLMENT_TYPES } from '@/lib/delivery';

export { calculateShipping } from '@/lib/delivery';

const checkoutItemSchema = z.object({
  item_type: z.literal('product'),
  item_id: z.string().uuid(),
  variant_id: z.string().uuid().optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(100),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim()
    .transform((value) => value.replace(/\s+/g, ''))
    .pipe(z.string().regex(/^(?:\+62|62|0)[0-9]{9,13}$/)),
  customer_email: z.string().trim().email().max(254).optional().or(z.literal('')),
  customer_address: z.string().trim().max(500).optional().default(''),
  fulfillment_type: z.enum(FULFILLMENT_TYPES).default('DELIVERY'),
  delivery_area: z.enum(DELIVERY_AREAS).default('POLEWALI'),
  items: z.array(checkoutItemSchema).min(1).max(50),
  payment_method: z.enum(['qris', 'transfer', 'cod', 'QRIS', 'BANK_TRANSFER', 'COD']),
  notes: z.string().trim().max(1000).optional(),
}).superRefine((data, context) => {
  if (data.fulfillment_type === 'DELIVERY' && data.customer_address.length < 5) {
    context.addIssue({ code: 'custom', path: ['customer_address'], message: 'Alamat pengantaran harus diisi' });
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export function normalizePaymentMethod(method: CheckoutInput['payment_method']) {
  if (method.toLowerCase() === 'qris') return PaymentMethod.QRIS;
  if (method.toLowerCase() === 'cod') return PaymentMethod.COD;
  return PaymentMethod.BANK_TRANSFER;
}
