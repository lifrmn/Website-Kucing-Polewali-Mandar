'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { blogService } from '@/services/blogService'
import { Loader2, Calendar, ArrowLeft } from 'lucide-react'

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

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-50 animate-pulse-custom"></div>
            <Loader2 className="animate-spin w-16 h-16 text-blue-600 mx-auto mb-4 relative" />
          </div>
          <p className="text-lg text-gray-700 font-medium">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <p className="text-gray-700 text-lg font-semibold">Artikel tidak ditemukan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
      <div className="container max-w-4xl">
        <button
          onClick={() => router.push('/blog')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Blog
        </button>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp">
          {post.featured_image && (
            <div className="relative overflow-hidden h-96">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-blue-600 mb-4 font-semibold">
              <Calendar className="w-5 h-5" />
              <time>
                {post.published_at ? formatDate(post.published_at) : 'Belum dipublikasi'}
              </time>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-lg">
                {post.excerpt}
              </p>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
