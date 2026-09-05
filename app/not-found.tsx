'use client'

import Link from 'next/link'
import { Cat, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 pb-16 pt-28">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-primary/35">
          <Cat className="h-12 w-12 text-secondary" />
        </div>
        <p className="mb-2 text-7xl font-bold text-dark-gold sm:text-8xl">404</p>
        <h1 className="mb-4 text-3xl font-bold text-text sm:text-4xl">
          Ups, halaman ini sedang bersembunyi.
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan. Anda dapat kembali ke beranda atau melihat produk kami.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-primary px-6 font-semibold text-[#2A2A1A] hover:bg-primary-hover">
            <Home className="h-5 w-5" /> Kembali ke Beranda
          </Link>
          <Link href="/produk" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-border bg-white px-6 font-semibold text-text hover:bg-surface2">
            <ShoppingBag className="h-5 w-5" /> Lihat Produk
          </Link>
        </div>
      </div>
    </main>
  )
}
