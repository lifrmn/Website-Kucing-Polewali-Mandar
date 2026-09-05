'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { blogService } from '@/services/blogService'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: Date | string | null
  is_published: boolean
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadPosts(page)
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async (requestedPage: number) => {
    setLoading(true)
    const response = await blogService.getPosts(requestedPage, 9)
    if (response.success && response.data) {
      setPosts(response.data.data)
      setTotalPages(response.data.totalPages)
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
      <LoadingSpinner message="Memuat artikel..." submessage="Menyiapkan tips perawatan kucing untuk Anda" size="md" />
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
                <FileText className="h-9 w-9 text-dark-gold" />
              </div>
              <p className="text-lg font-semibold mb-3" style={{ color: '#383838' }}>Belum ada artikel tersedia</p>
              <p className="text-sm" style={{ color: '#707070' }}>Artikel menarik akan segera hadir!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-card border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                {post.featured_image ? (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/placeholder-product.svg'
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-primary/40">
                    <FileText className="h-10 w-10 text-secondary" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3 font-semibold text-dark-gold">
                    <Calendar className="w-4 h-4" />
                    <time>{post.published_at ? formatDate(post.published_at) : 'Belum dipublikasi'}</time>
                  </div>

                  <h2 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]" style={{ color: '#383838' }}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: '#707070' }}>
                    {post.excerpt || 'Baca artikel selengkapnya.'}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-sm text-dark-gold hover:text-secondary transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Navigasi halaman artikel">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg border-2 disabled:opacity-40"
              style={{ borderColor: '#E8E3DA', color: '#383838' }}
              aria-label="Halaman sebelumnya"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold" style={{ color: '#707070' }}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg border-2 disabled:opacity-40"
              style={{ borderColor: '#E8E3DA', color: '#383838' }}
              aria-label="Halaman berikutnya"
              title="Halaman berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}
