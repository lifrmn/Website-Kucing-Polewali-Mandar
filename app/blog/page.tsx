'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { blogService } from '@/services/blogService'
import { Loader2, Calendar, ArrowRight } from 'lucide-react'

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const response = await blogService.getPosts()
    if (response.success && response.data) {
      setPosts(response.data.data)
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
          <p className="text-lg text-gray-700 font-medium">Memuat artikel menarik untuk Anda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-24 bg-gray-50 min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold border border-blue-600 mb-4 shadow-md">
            <span>📚</span>
            <span>Artikel & Tips</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Tips Kesehatan Kucing
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Artikel dan tips bermanfaat untuk merawat kucing kesayangan Anda
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-xl p-12 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-3">Belum ada artikel tersedia</p>
              <p className="text-sm text-gray-500">Artikel menarik akan segera hadir!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-400"
              >
                {post.featured_image ? (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-blue-500 flex items-center justify-center">
                    <span className="text-5xl">📖</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-blue-600 mb-3 font-semibold">
                    <Calendar className="w-4 h-4" />
                    <time>{post.published_at ? formatDate(post.published_at) : 'Belum dipublikasi'}</time>
                  </div>

                  <h2 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2 min-h-[3.5rem]">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
