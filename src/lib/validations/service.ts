import { z } from 'zod';

const serviceFields = {
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2_000).optional(),
  type: z.string().trim().min(2).max(50),
  duration: z.coerce.number().int().min(1).max(1_440).optional(),
  price: z.coerce.number().finite().min(0).max(1_000_000_000),
  max_bookings_per_day: z.coerce.number().int().min(1).max(100).default(5),
  is_active: z.boolean().optional(),
};

export const createServiceSchema = z.object(serviceFields).strict();

export const updateServiceSchema = z.object({
  name: serviceFields.name.optional(),
  description: serviceFields.description,
  type: serviceFields.type.optional(),
  duration: serviceFields.duration.nullable(),
  price: serviceFields.price.optional(),
  max_bookings_per_day: serviceFields.max_bookings_per_day.optional(),
  is_active: serviceFields.is_active,
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);
