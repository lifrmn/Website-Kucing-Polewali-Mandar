import { z } from 'zod';

const normalizedPhoneSchema = z.string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ''))
  .pipe(z.string().regex(/^(?:\+62|62|0)[0-9]{9,13}$/));

export const customerOrderLookupSchema = z.object({
  order_number: z.string().trim().toUpperCase().min(10).max(50).regex(/^INV-[A-Z0-9-]+$/),
  customer_phone: normalizedPhoneSchema,
}).strict();

export type CustomerOrderLookupInput = z.infer<typeof customerOrderLookupSchema>;
