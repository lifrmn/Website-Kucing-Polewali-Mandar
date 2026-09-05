import { z } from 'zod';

import { OrderStatus, PaymentStatus } from '@/types/enums';

export const orderUpdateSchema = z.object({
  payment_status: z.enum(PaymentStatus).optional(),
  status: z.enum(OrderStatus).optional(),
  admin_notes: z.string().trim().max(2_000).nullable().optional(),
  tracking_number: z.string().trim().max(100).nullable().optional(),
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);

export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;

export const paymentProofUpdateSchema = z.object({
  payment_proof_url: z.url().refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  }, 'URL bukti pembayaran harus menggunakan HTTP atau HTTPS'),
}).strict();
