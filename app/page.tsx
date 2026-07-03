'use client'

import Link from 'next/link'
import { ShoppingBag, Bed, Scissors } from 'lucide-react'

const PALETTE = {
  bg: '#FAF8F5',
  hero: '#3b3a2e',
  primary: '#E6D18B',
  stats: '#F0E6DC',
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
        className="relative overflow-hidden"
        style={{ backgroundColor: PALETTE.hero, minHeight: '100vh' }}
      >
        {/* Right: cat photo */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=80"
            alt="Kucing"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to right, ${PALETTE.hero} 0%, rgba(59,58,46,0.6) 35%, transparent 60%)` }}
          />
        </div>

        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80"
            alt="Kucing"
            className="w-full h-full object-cover"
            style={{ opacity: 0.25 }}
          />
        </div>

        {/* Hero text — left side */}
        <div
          className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center"
          style={{ minHeight: '100vh' }}
        >
          <div className="max-w-lg pt-24 pb-36 md:pb-28">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: PALETTE.primary }}>
              Cikal Pet Care — Polewali Mandar
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Temukan<br />perawatan<br />kucing terbaik
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Di sini terdapat berbagai layanan profesional yang menunggu kucing kesayangan Anda.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Mereka membutuhkan keluarga yang menyayangi dan tempat yang nyaman.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-full text-base transition-all duration-300 hover:opacity-90 hover:shadow-xl"
              style={{ backgroundColor: PALETTE.primary, color: '#2a2a1a', boxShadow: '0 4px 20px rgba(214,184,90,0.4)' }}
            >
              Booking Sekarang
            </Link>
          </div>
        </div>

        {/* Feature cards — floating above wave */}
        <div className="absolute bottom-10 left-0 right-0 z-20 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Scissors, bold: 'Grooming', text: 'profesional', link: '/layanan' },
              { icon: Bed,      bold: 'Penitipan', text: 'aman & nyaman', link: '/booking' },
              { icon: ShoppingBag, bold: 'Produk', text: 'lengkap', link: '/produk' },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className="group bg-white rounded-[20px] p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#FDE8E8' }}
                >
                  <card.icon size={26} style={{ color: '#B66D6D' }} />
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
              Layanan yang Menunggu Anda?
            </h2>
            <p style={{ color: PALETTE.muted }} className="text-base max-w-md mx-auto">
              Klik pada layanan untuk mengetahui lebih lanjut dan melakukan booking.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { name: 'Grooming Lengkap',       image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Mandi & Blow',            image: 'https://images.unsplash.com/photo-1583512603806-077998240c7a?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Penitipan Premium',       image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=500&auto=format&fit=crop', link: '/booking' },
              { name: 'Konsultasi Kesehatan',    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop', link: '/layanan' },
              { name: 'Makanan Premium',         image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=500&auto=format&fit=crop', link: '/produk' },
              { name: 'Aksesori Kucing',         image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop', link: '/produk' },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="group bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2"
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

      {/* ====================================================
          STATISTICS SECTION — wavy, light pink bg
          ==================================================== */}
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
            Statistik Kami
          </h2>
          <p className="text-base mb-16" style={{ color: PALETTE.muted }}>
            Kepercayaan pelanggan adalah kebanggaan kami
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop', value: '500+', label: 'pelanggan',       bg: '#7c6b5d' },
              { image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop', value: '1000+', label: 'kucing terlayani', bg: '#E6D18B' },
              { image: 'https://images.unsplash.com/photo-1601758123927-196f50a06d64?w=300&auto=format&fit=crop', value: '3',     label: 'jenis layanan',   bg: '#a0714c' },
              { image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?w=300&auto=format&fit=crop', value: '5.0',   label: 'rating bintang',  bg: '#B66D6D' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4">
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    width: 110,
                    height: 110,
                    backgroundColor: stat.bg,
                    border: '4px solid white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  <img src={stat.image} alt={stat.label} className="w-full h-full object-cover" />
                </div>
                <p className="text-3xl font-bold" style={{ color: PALETTE.text }}>{stat.value}</p>
                <p className="text-sm" style={{ color: PALETTE.muted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom — transition into footer */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z" fill="#707070" />
          </svg>
        </div>
      </section>

    </div>
  )
}
