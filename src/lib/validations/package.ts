import { z } from 'zod';

const featuresSchema = z.union([
  z.array(z.string().trim().min(1).max(200)).max(50),
  z.string().trim().max(10_000),
]);

const packageFields = {
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2_000).optional(),
  price_per_night: z.coerce.number().finite().min(0).max(1_000_000_000),
  features: featuresSchema.default([]),
  max_cats: z.coerce.number().int().min(1).max(100).default(1),
  is_active: z.boolean().optional(),
};

export const createPackageSchema = z.object(packageFields).strict();

export const updatePackageSchema = z.object({
  name: packageFields.name.optional(),
  description: packageFields.description,
  price_per_night: packageFields.price_per_night.optional(),
  features: featuresSchema.optional(),
  max_cats: packageFields.max_cats.optional(),
  is_active: packageFields.is_active,
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);
