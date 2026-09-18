import { z } from 'zod'

const optionalUrl = z.union([z.literal(''), z.string().trim().url().max(2_000)]).optional()
const optionalText = (max: number) => z.string().trim().max(max).optional()
const commonFields = {
  is_published: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).max(10_000).default(0),
}

const galleryFields = z.object({
  title: z.string().trim().min(2).max(120),
  kind: z.enum(['GALLERY', 'BEFORE_AFTER']),
  image_url: optionalUrl,
  before_image_url: optionalUrl,
  after_image_url: optionalUrl,
  description: optionalText(500),
  ...commonFields,
}).superRefine((data, context) => {
  if (data.kind === 'GALLERY' && !data.image_url) {
    context.addIssue({ code: 'custom', path: ['image_url'], message: 'Gambar galeri wajib diisi' })
  }
  if (data.kind === 'BEFORE_AFTER' && (!data.before_image_url || !data.after_image_url)) {
    context.addIssue({ code: 'custom', path: ['before_image_url'], message: 'Gambar sebelum dan sesudah wajib diisi' })
  }
})

const teamFields = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(100),
  bio: optionalText(500),
  image_url: optionalUrl,
  ...commonFields,
})

const testimonialFields = z.object({
  customer_name: z.string().trim().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(5).max(1_000),
  service_type: optionalText(100),
  is_approved: z.boolean().default(false),
  is_featured: z.boolean().default(false),
})

export const trustContentCreateSchema = z.discriminatedUnion('resource', [
  z.object({ resource: z.literal('gallery'), data: galleryFields }),
  z.object({ resource: z.literal('team'), data: teamFields }),
  z.object({ resource: z.literal('testimonial'), data: testimonialFields }),
])

export const trustContentUpdateSchema = z.object({
  resource: z.enum(['gallery', 'team', 'testimonial']),
  id: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
})

export const trustContentDeleteSchema = z.object({
  resource: z.enum(['gallery', 'team', 'testimonial']),
  id: z.string().uuid(),
})

export function parseTrustContentUpdate(input: unknown) {
  const base = trustContentUpdateSchema.parse(input)
  const schema = base.resource === 'gallery'
    ? galleryFields
    : base.resource === 'team'
      ? teamFields
      : testimonialFields
  return { ...base, data: schema.parse(base.data) }
}