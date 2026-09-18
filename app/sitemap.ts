import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/layanan',
    '/produk',
    '/booking',
    '/blog',
    '/kontak',
    '/tentang',
    '/faq',
    '/pesanan',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  try {
    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        where: { is_active: true },
        select: { slug: true, updated_at: true },
      }),
      prisma.blogPost.findMany({
        where: { is_published: true, deleted_at: null },
        select: { slug: true, updated_at: true },
      }),
    ])

    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${siteUrl}/produk/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch (error) {
    console.error('Sitemap database query failed:', error)
    return staticRoutes
  }
}