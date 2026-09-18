import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import { BlogInitialDataProvider } from './BlogInitialData'

export const metadata: Metadata = {
  title: 'Tips Perawatan Kucing',
  description: 'Baca artikel dan panduan praktis untuk menjaga kesehatan serta kenyamanan kucing kesayangan Anda.',
  alternates: { canonical: '/blog' },
}

export default async function BlogLayout({ children }: { children: ReactNode }) {
  const where = { is_published: true, deleted_at: null }
  const [records, total] = await prisma.$transaction([
    prisma.blogPost.findMany({
      where,
      take: 9,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        published_at: true,
        is_published: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ])
  const posts = records.map((post) => ({
    ...post,
    published_at: post.published_at?.toISOString() ?? null,
  }))

  return <BlogInitialDataProvider data={{ posts, totalPages: Math.max(1, Math.ceil(total / 9)) }}>{children}</BlogInitialDataProvider>
}
