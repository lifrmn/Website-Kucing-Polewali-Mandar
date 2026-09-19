import { z } from 'zod';

export const cartSyncSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    type: z.literal('product'),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(100),
  }).strict()).min(1).max(50),
}).strict();