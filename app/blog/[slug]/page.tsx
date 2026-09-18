import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import prisma from '@/lib/prisma'
import { sanitizeBlogHtml } from '@/lib/sanitize-html'

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getPublishedPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      is_published: true,
      deleted_at: null,
    },
  })
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      publishedTime: post.published_at?.toISOString(),
      images: post.featured_image ? [{ url: post.featured_image, alt: post.title }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-bg pb-24 pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <Link
          href="/blog"
          className="group mb-8 inline-flex min-h-11 items-center gap-2 rounded-button px-3 py-2 font-semibold text-dark-gold transition-colors hover:bg-surface2 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          Kembali ke Blog
        </Link>

        <article className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
          {post.featured_image && (
            <div className="relative h-64 overflow-hidden sm:h-80 md:h-96">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-12">
            {post.published_at && (
              <div className="mb-4 flex items-center gap-2 font-semibold text-dark-gold">
                <Calendar className="h-5 w-5" aria-hidden="true" />
                <time dateTime={post.published_at.toISOString()}>{formatDate(post.published_at)}</time>
              </div>
            )}

            <h1 className="mb-6 text-3xl font-bold leading-tight text-text md:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mb-8 rounded-r-lg border-l-4 border-primary-hover bg-surface2 py-3 pl-6 text-lg leading-relaxed text-muted md:text-xl">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none leading-relaxed prose-headings:text-text prose-p:text-text prose-a:text-dark-gold prose-strong:text-text prose-img:rounded-card"
              dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
