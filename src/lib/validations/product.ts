import { z } from 'zod';

const productImageUrlSchema = z.union([
  z.literal(''),
  z.string().trim().max(2_000).refine((value) => {
    if (value.startsWith('/')) return !value.startsWith('//');
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL gambar harus berupa path lokal atau HTTPS'),
]).optional().nullable();

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Nama varian wajib diisi').max(100),
  sku: z.string().trim().min(3, 'SKU varian minimal 3 karakter').max(100),
  price: z.number().finite().min(1000, 'Harga varian minimal Rp 1.000').max(1_000_000_000).nullable().optional(),
  stock: z.number().int().min(0, 'Stok varian tidak boleh negatif').max(1_000_000),
  attributes: z.record(z.string().max(50), z.string().max(200))
    .refine((value) => Object.keys(value).length <= 20, 'Atribut varian maksimal 20')
    .default({}),
  is_active: z.boolean().default(true),
}).strict();

// Product validation schema
export const productSchema = z.object({
  name: z.string().trim().min(3, 'Nama produk minimal 3 karakter').max(150),
  slug: z.string().trim().min(3, 'Slug minimal 3 karakter').max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter').max(10_000).optional().nullable(),
  sku: z.string().trim().min(3, 'SKU minimal 3 karakter').max(100),
  price: z.number().finite().min(1000, 'Harga minimal Rp 1.000').max(1_000_000_000),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif').max(1_000_000),
  category: z.string().trim().min(1, 'Kategori wajib diisi').max(100),
  image_url: productImageUrlSchema,
  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),
  low_stock_alert: z.number().int().min(0).max(1_000_000).default(5),
  variants: z.array(productVariantSchema).max(100).default([]),
}).strict();

export const productUpdateSchema = productSchema.partial().extend({
  id: z.string().uuid(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
