import { z } from 'zod';

const optionalUrl = z.union([
  z.literal(''),
  z.string().trim().url().max(2_000).refine(
    (value) => value.startsWith('https://') || value.startsWith('http://'),
    'URL harus menggunakan HTTP atau HTTPS'
  ),
]).optional();

const blogFields = {
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(220),
  content: z.string().trim().min(1).max(200_000),
  excerpt: z.string().trim().max(500).optional(),
  featured_image: optionalUrl,
  category: z.string().trim().max(100).optional(),
  tags: z.string().trim().max(1_000).optional(),
  meta_title: z.string().trim().max(60).optional(),
  meta_description: z.string().trim().max(160).optional(),
  is_published: z.boolean().default(false),
};

export const createBlogPostSchema = z.object(blogFields).strict();
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = z.object({
  title: blogFields.title.optional(),
  slug: blogFields.slug.optional(),
  content: blogFields.content.optional(),
  excerpt: blogFields.excerpt,
  featured_image: blogFields.featured_image,
  category: blogFields.category,
  tags: blogFields.tags,
  meta_title: blogFields.meta_title,
  meta_description: blogFields.meta_description,
  is_published: z.boolean().optional(),
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
