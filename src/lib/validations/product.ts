import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').optional().nullable(),
  sku: z.string().min(3, 'SKU minimal 3 karakter'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),
  low_stock_alert: z.number().int().min(0).default(5),
});

export const productUpdateSchema = productSchema.partial().extend({
  id: z.string(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
