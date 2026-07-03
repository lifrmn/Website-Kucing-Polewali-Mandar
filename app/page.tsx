'use client'

import Link from 'next/link'
import { ShoppingBag, Bed, Phone, Heart, Users, Award, Scissors, ArrowRight, MapPin, Mail, PawPrint } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f5f2', fontFamily: "'Inter', sans-serif" }}>

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#3b3a2e', minHeight: '92vh' }}>
        {/* Cat Hero Image - right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80"
            alt="Kucing"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
          {/* gradient overlay to blend into dark bg */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #3b3a2e 0%, transparent 40%)' }} />
        </div>

        {/* Background image for mobile */}
        <div className="absolute inset-0 md:hidden">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80"
            alt="Kucing"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center" style={{ minHeight: '92vh' }}>
          <div className="max-w-xl py-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Temukan perawatan<br />kucing terbaik
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-4 leading-relaxed">
              Di Cikal Pet Care, terdapat berbagai layanan profesional yang menunggu kucing kesayangan Anda.
            </p>
            <p className="text-base text-gray-300 mb-10 leading-relaxed">
              Mereka membutuhkan keluarga yang menyayangi dan tempat yang nyaman.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-full text-base transition-all duration-300 shadow-lg hover:opacity-90"
              style={{ backgroundColor: '#c9b44a', color: '#2a2a1a' }}
            >
              Booking Sekarang
            </Link>
          </div>
        </div>

        {/* Feature Cards - floating at bottom */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 -mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-0">
            {[
              {
                icon: Scissors,
                bold: 'Grooming',
                text: 'kucing',
              },
              {
                icon: Bed,
                bold: 'Penitipan',
                text: 'yang nyaman',
              },
              {
                icon: ShoppingBag,
                bold: 'Produk',
                text: 'lengkap',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#fde8e8' }}
                >
                  <card.icon size={26} style={{ color: '#e05c5c' }} />
                </div>
                <p className="text-gray-900 font-semibold text-base">
                  <span className="font-bold">{card.bold}</span> {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer for floating cards */}
      <div className="pt-24" style={{ backgroundColor: '#f9f5f2' }} />

      {/* ========================================
          WHO IS WAITING SECTION
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#f9f5f2' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Layanan yang Menunggu Anda?
            </h2>
            <p className="text-gray-500 text-base">
              Klik pada layanan untuk mengetahui lebih lanjut dan melakukan booking.
            </p>
          </div>

          {/* Cat Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Grooming Lengkap',
                image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop',
                link: '/layanan',
              },
              {
                name: 'Mandi & Blow',
                image: 'https://images.unsplash.com/photo-1583512603806-077998240c7a?w=500&auto=format&fit=crop',
                link: '/layanan',
              },
              {
                name: 'Penitipan Premium',
                image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=500&auto=format&fit=crop',
                link: '/booking',
              },
              {
                name: 'Konsultasi Kesehatan',
                image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop',
                link: '/layanan',
              },
              {
                name: 'Makanan Premium',
                image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=500&auto=format&fit=crop',
                link: '/produk',
              },
              {
                name: 'Aksesori Kucing',
                image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop',
                link: '/produk',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="font-semibold text-gray-800 text-base">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* More Button */}
          <div className="text-center mt-10">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-10 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: '#c9b44a', color: '#2a2a1a' }}
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          STATISTICS SECTION
          ======================================== */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f0e4df' }}>
        {/* Wavy top */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f9f5f2" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Statistik Kami</h2>
          <p className="text-gray-500 text-base mb-14">Kepercayaan pelanggan adalah kebanggaan kami</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop',
                value: '500+',
                label: 'pelanggan',
                bg: '#7c6b5d',
              },
              {
                image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop',
                value: '1000+',
                label: 'kucing terlayani',
                bg: '#e8d44d',
              },
              {
                image: 'https://images.unsplash.com/photo-1601758123927-196f50a06d64?w=300&auto=format&fit=crop',
                value: '3',
                label: 'jenis layanan',
                bg: '#a0714c',
              },
              {
                image: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?w=300&auto=format&fit=crop',
                value: '5.0',
                label: 'rating bintang',
                bg: '#c94c4c',
              },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full overflow-hidden border-4 border-white shadow-lg"
                  style={{ width: 100, height: 100, backgroundColor: stat.bg }}
                >
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wavy bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,80 L0,80 Z" fill="#3b3a2e" />
          </svg>
        </div>
      </section>

      {/* ========================================
          FOOTER CTA / CONTACT SECTION
          ======================================== */}
      <footer style={{ backgroundColor: '#3b3a2e' }} className="pt-20 pb-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#c9b44a' }}
            >
              <PawPrint size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-tight">Cikal Pet Care</p>
              <p className="text-xs text-gray-400">Polewali Mandar</p>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Alamat</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Jl. Kemakmuran</li>
                <li>Kel. Manding, Kec. Polewali</li>
                <li>Polewali Mandar</li>
                <li>Sulawesi Barat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Kontak</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>info@cikalpetcare.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>+62 852-5547-8706</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} />
                  <Link href="/kontak" className="hover:text-white transition-colors">Lihat Peta</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Layanan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/layanan" className="hover:text-white transition-colors">Grooming Kucing</Link></li>
                <li><Link href="/booking" className="hover:text-white transition-colors">Penitipan Kucing</Link></li>
                <li><Link href="/produk" className="hover:text-white transition-colors">Produk &amp; Aksesori</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Tips Kesehatan</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider + Copyright */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Cikal Pet Care — Polewali Mandar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
