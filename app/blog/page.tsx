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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="animate-spin w-16 h-16 mx-auto mb-4" style={{ color: '#E6D18B' }} />
          </div>
          <p className="text-lg font-medium" style={{ color: '#383838' }}>Memuat artikel menarik untuk Anda...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Tips Kesehatan Kucing
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Artikel dan tips bermanfaat untuk merawat kucing kesayangan Anda
          </p>
        </div>
        {/* Wave bottom */}
        <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 md:py-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto rounded-[20px] p-12 shadow-md" style={{ backgroundColor: 'white' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FAF8F5' }}>
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-lg font-semibold mb-3" style={{ color: '#383838' }}>Belum ada artikel tersedia</p>
              <p className="text-sm" style={{ color: '#707070' }}>Artikel menarik akan segera hadir!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:scale-105" style={{ borderColor: '#E8E3DA' }}
              >
                {post.featured_image ? (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#E6D18B' }}>
                    <span className="text-5xl">📖</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3 font-semibold" style={{ color: '#E6D18B' }}>
                    <Calendar className="w-4 h-4" />
                    <time>{post.published_at ? formatDate(post.published_at) : 'Belum dipublikasi'}</time>
                  </div>

                  <h2 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]" style={{ color: '#383838' }}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: '#707070' }}>
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity" style={{ color: '#E6D18B' }}
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
    </main>
  )
}
