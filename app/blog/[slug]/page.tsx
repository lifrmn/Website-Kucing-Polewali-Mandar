'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { blogService } from '@/services/blogService'
import { Calendar, ArrowLeft, FileQuestion } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  published_at: Date | string | null
  is_published: boolean
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPost = async () => {
    if (!slug) return

    setLoading(true)
    const response = await blogService.getPostBySlug(slug)
    
    if (response.success && response.data) {
      setPost(response.data)
    } else {
      router.push('/blog')
    }
    setLoading(false)
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
  }

  if (loading) {
    return (
      <LoadingSpinner message="Memuat artikel..." size="md" />
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-bg px-5 pt-24">
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-card border border-border bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface2">
              <FileQuestion className="h-9 w-9 text-muted" />
            </div>
            <p className="text-gray-700 text-lg font-semibold">Artikel tidak ditemukan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg pb-24 pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <button
          onClick={() => router.push('/blog')}
          className="group mb-8 flex min-h-11 items-center gap-2 rounded-button px-3 py-2 font-semibold text-dark-gold transition-colors hover:bg-surface2 hover:text-secondary"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Blog
        </button>

        <article className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
          {post.featured_image && (
            <div className="relative overflow-hidden h-96">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = '/placeholder-product.svg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="mb-4 flex items-center gap-2 font-semibold text-dark-gold">
              <Calendar className="w-5 h-5" />
              <time>
                {post.published_at ? formatDate(post.published_at) : 'Belum dipublikasi'}
              </time>
            </div>

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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
