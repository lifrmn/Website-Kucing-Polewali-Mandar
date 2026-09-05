'use client'

import Link from 'next/link'
import { ArrowRight, Bed, Clock3, HeartHandshake, Scissors, ShieldCheck, ShoppingBag } from 'lucide-react'

const PALETTE = {
  bg: '#FAF8F5',
  hero: '#3b3a2e',
  primary: '#E6D18B',
  stats: '#F3EFE8',
  text: '#383838',
  muted: '#707070',
}

export default function HomePage() {
  return (
    <div style={{ backgroundColor: PALETTE.bg, fontFamily: "'Poppins', 'Inter', sans-serif" }}>

      {/* ====================================================
          HERO SECTION — 100vh, split layout, wave bottom
          ==================================================== */}
      <section
        className="relative min-h-[760px] overflow-hidden md:min-h-screen"
        style={{ backgroundColor: PALETTE.hero }}
      >
        {/* Right: cat photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=80"
            alt="Kucing"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 34%' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, rgba(47,46,37,0.96) 0%, rgba(59,58,46,0.82) 42%, rgba(59,58,46,0.28) 78%, rgba(59,58,46,0.12) 100%)` }}
          />
        </div>

        {/* Hero text — left side */}
        <div
          className="relative z-10 mx-auto flex min-h-[610px] max-w-6xl items-center px-6 sm:px-8 md:min-h-screen lg:px-12"
        >
          <div className="max-w-xl pb-12 pt-24 md:pb-28">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: PALETTE.primary }}>
              Cikal Pet Care — Polewali Mandar
            </p>
            <h1
              className="text-[clamp(2.25rem,6vw,3.75rem)] font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Perawatan Terbaik untuk Kucing Kesayangan Anda
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Grooming, penitipan, dan kebutuhan kucing dalam satu tempat yang aman, bersih, dan ditangani dengan penuh perhatian.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-primary px-7 font-semibold text-[#2A2A1A] hover:bg-primary-hover">
                Booking Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/layanan" className="inline-flex min-h-12 items-center justify-center rounded-button border border-white/40 bg-white/10 px-7 font-semibold text-white hover:bg-white/15">
                Lihat Layanan
              </Link>
            </div>
          </div>
        </div>

        {/* Feature cards — floating above wave */}
        <div className="relative z-20 px-6 pb-10 sm:px-8 md:absolute md:bottom-8 md:left-0 md:right-0 md:pb-0">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Scissors, bold: 'Grooming', text: 'profesional', link: '/layanan' },
              { icon: Bed,      bold: 'Penitipan', text: 'aman & nyaman', link: '/booking' },
              { icon: ShoppingBag, bold: 'Produk', text: 'lengkap', link: '/produk' },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className="group bg-white rounded-card p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/35">
                  <card.icon size={26} className="text-secondary" />
                </div>
                <p className="font-semibold text-[#383838] text-sm">
                  <span className="font-bold">{card.bold}</span> {card.text}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: 0 }}>
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px', marginBottom: '-2px' }}>
            <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill={PALETTE.bg} />
          </svg>
        </div>
      </section>

      {/* ====================================================
          LAYANAN / GRID SECTION
          ==================================================== */}
      <section className="py-20 md:py-28" style={{ backgroundColor: PALETTE.bg }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: PALETTE.text, fontFamily: "'Poppins', sans-serif" }}
            >
              Layanan Terbaik untuk Kucing Anda
            </h2>
            <p style={{ color: PALETTE.muted }} className="text-base max-w-md mx-auto">
              Klik pada layanan untuk mengetahui lebih lanjut dan melakukan booking.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { name: 'Grooming Lengkap',       image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Mandi & Blow',            image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Penitipan Premium',       image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=500&auto=format&fit=crop', link: '/booking' },
              { name: 'Konsultasi Kesehatan',    image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Makanan Premium',         image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=500&auto=format&fit=crop', link: '/produk' },
              { name: 'Aksesori Kucing',         image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop', link: '/produk' },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="group bg-white rounded-card overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
              >
                <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ borderRadius: '20px 20px 0 0' }}
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="font-semibold text-sm" style={{ color: PALETTE.text }}>{item.name}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-10 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: PALETTE.primary, color: '#2a2a1a', boxShadow: '0 4px 14px rgba(214,184,90,0.35)' }}
            >
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

        {/* Service principles replace unverified marketing metrics. */}
      <section className="relative py-28" style={{ backgroundColor: PALETTE.stats }}>
        {/* Wave top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z" fill={PALETTE.bg} />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: PALETTE.text, fontFamily: "'Poppins', sans-serif" }}
          >
            Kenapa Memilih Cikal Pet Care
          </h2>
          <p className="text-base mb-16" style={{ color: PALETTE.muted }}>
            Perawatan yang dirancang agar kucing nyaman dan pemilik merasa tenang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: 'Aman dan Bersih', description: 'Proses perawatan mengutamakan kebersihan dan kenyamanan kucing.' },
              { icon: HeartHandshake, title: 'Ditangani dengan Peduli', description: 'Setiap kucing mendapat perhatian sesuai kebutuhan dan kondisinya.' },
              { icon: Clock3, title: 'Mudah Dijadwalkan', description: 'Pilih layanan dan waktu kunjungan melalui alur booking yang jelas.' },
            ].map((item) => (
              <div key={item.title} className="rounded-card border border-border bg-white p-7 text-left shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-button bg-primary/35"><item.icon className="h-6 w-6 text-secondary" /></div>
                <p className="mb-2 text-xl font-semibold text-text">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom — transition into footer */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" fill="#2F2E25" />
          </svg>
        </div>
      </section>

    </div>
  )
}
