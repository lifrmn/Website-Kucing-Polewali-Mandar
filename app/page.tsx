'use client'

import Link from 'next/link'
import { ShoppingBag, Bed, Star, Shield, Tag, Stethoscope, MapPin, Clock, Phone, ArrowRight, Check, Scissors, Heart, Users, Award, TrendingUp, MessageSquare, Mail, Sparkles, Quote } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Perawatan Kucing Terbaik di Polewali Mandar
            </h1>
            
            <p className="text-base md:text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed">
              Layanan profesional untuk kesehatan dan kebahagiaan kucing kesayangan Anda. Konsultasi gratis tersedia.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
              >
                <AppIcon icon={Bed} size="md" />
                <span className="leading-none">Booking Sekarang</span>
              </Link>
              <Link 
                href="/layanan" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-base"
              >
                <span className="leading-none">Lihat Layanan</span>
                <AppIcon icon={ArrowRight} size="md" />
              </Link>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-12 mt-12 border-t border-white/20">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</p>
              <p className="text-sm text-blue-100">Kucing Terlayani</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">5.0</p>
              <p className="text-sm text-blue-100">Rating Pelanggan</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</p>
              <p className="text-sm text-blue-100">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          TRUST SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Rating Stars */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <AppIcon key={i} icon={Star} size="lg" className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            {/* Rating Text */}
            <div>
              <p className="text-xl md:text-2xl text-gray-700 mb-2">
                <span className="font-bold text-gray-900 text-3xl md:text-4xl">5.0</span> dari 500+ Review
              </p>
              <p className="text-base md:text-lg font-semibold text-gray-700">1000+ Kucing Terlayani</p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                href="/produk" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg text-base"
              >
                <AppIcon icon={ShoppingBag} size="md" />
                <span className="leading-none">Belanja Produk</span>
              </Link>
              
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-md text-base"
              >
                <AppIcon icon={Bed} size="md" />
                <span className="leading-none">Booking Layanan</span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base text-gray-700 pt-4">
              <span className="flex items-center gap-2 font-semibold">
                <AppIcon icon={Check} size="md" className="text-green-600" />
                <span className="leading-none">Terpercaya & Aman</span>
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <AppIcon icon={Check} size="md" className="text-green-600" />
                <span className="leading-none">Tim Profesional</span>
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <AppIcon icon={Check} size="md" className="text-green-600" />
                <span className="leading-none">Harga Transparan</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold mb-4 border border-blue-100 text-sm">
              Keunggulan Kami
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Mengapa Memilih Cikal Pet Care?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Pelayanan terbaik dengan fasilitas modern dan tim profesional
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Shield, 
                title: 'Tempat Aman & Bersih', 
                desc: 'Fasilitas higienis dengan standar kesehatan tinggi',
                gradient: 'from-blue-500 to-blue-600',
              },
              { 
                icon: Tag, 
                title: 'Harga Terjangkau', 
                desc: 'Layanan berkualitas dengan harga yang kompetitif',
                gradient: 'from-indigo-500 to-indigo-600',
              },
              { 
                icon: Stethoscope, 
                title: 'Tim Profesional', 
                desc: 'Ahli kesehatan kucing berpengalaman dan bersertifikat',
                gradient: 'from-cyan-500 to-cyan-600',
              },
              { 
                icon: MapPin, 
                title: 'Lokasi Strategis', 
                desc: 'Mudah dijangkau di pusat kota Polewali Mandar',
                gradient: 'from-teal-500 to-teal-600',
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-105 transition-all duration-300`}>
                  <AppIcon icon={feature.icon} size="lg" className="text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SERVICES SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl font-semibold mb-4 border border-blue-100 text-sm">
              Layanan Kami
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Layanan Profesional untuk Kucing
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Dapatkan layanan terbaik dengan fasilitas modern dan tim berpengalaman
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="space-y-8 max-w-7xl mx-auto">
            {[
              {
                title: 'Produk & Perlengkapan',
                desc: 'Berbagai produk makanan premium, mainan, dan perlengkapan lengkap untuk kebutuhan kucing Anda',
                icon: ShoppingBag,
                link: '/produk',
                image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800&auto=format&fit=crop&q=80'
              },
              {
                title: 'Grooming & Kesehatan',
                desc: 'Layanan grooming profesional dan konsultasi kesehatan untuk menjaga kucing tetap sehat',
                icon: Scissors,
                link: '/layanan',
                image: 'https://images.unsplash.com/photo-1585289167915-67cfeb4e6b52?w=800&auto=format&fit=crop&q=80'
              },
              {
                title: 'Penitipan Kucing',
                desc: 'Tempat penitipan yang aman, nyaman, dan bersih dengan pengawasan 24 jam',
                icon: Bed,
                link: '/booking',
                image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=800&auto=format&fit=crop&q=80'
              },
            ].map((service, idx) => (
              <Link key={idx} href={service.link} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Image */}
                    <div className={`relative h-64 md:h-80 overflow-hidden md:col-span-2 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-900/30 to-transparent" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <AppIcon icon={service.icon} size="md" className="text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`md:col-span-3 p-6 md:p-8 flex flex-col justify-center ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-base text-gray-600 mb-6 leading-relaxed">
                        {service.desc}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
                        <span className="leading-none">Lihat Selengkapnya</span>
                        <AppIcon icon={ArrowRight} size="md" className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          TESTIMONIALS SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-semibold mb-4 border border-amber-100 text-sm">
              Testimoni Pelanggan
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Kata Mereka Tentang Kami
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: 'Ibu Siti Rahma',
                role: 'Pemilik 3 Kucing Persia',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
                rating: 5,
                text: 'Pelayanan sangat memuaskan! Kucing saya selalu terlihat bahagia setelah grooming di Cikal Pet Care. Tim yang ramah dan profesional.'
              },
              {
                name: 'Bapak Ahmad Rizki',
                role: 'Pemilik Kucing Maine Coon',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
                rating: 5,
                text: 'Tempat penitipan terbaik di Polman! Fasilitasnya bersih dan kucing saya dirawat dengan penuh kasih sayang. Sangat direkomendasikan.'
              },
              {
                name: 'Ibu Fitri Amaliah',
                role: 'Pemilik 2 Kucing British Shorthair',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
                rating: 5,
                text: 'Produknya lengkap dan berkualitas. Harganya juga terjangkau. Konsultasi kesehatan kucing sangat membantu. Terima kasih Cikal Pet Care!'
              },
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-200"
              >
                {/* Quote Icon */}
                <AppIcon icon={Quote} size="lg" className="text-blue-200 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <AppIcon key={i} icon={Star} size="sm" className="fill-amber-400 text-amber-400 flex-shrink-0" />
                  ))}
                </div>
                
                {/* Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-base">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t-2 border-gray-100">
            {[
              { icon: Users, value: '500+', label: 'Pelanggan Puas' },
              { icon: Heart, value: '1000+', label: 'Kucing Terawat' },
              { icon: Award, value: '5.0', label: 'Rating Bintang' },
              { icon: TrendingUp, value: '100%', label: 'Kepuasan' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AppIcon icon={stat.icon} size="md" className="text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          BLOG/TIPS SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mb-16 gap-6">
            <div>
              <span className="inline-block px-5 py-2.5 bg-purple-50 text-purple-600 rounded-xl font-semibold mb-4 border-2 border-purple-100">
                Tips & Artikel
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Tips Merawat Kucing
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Panduan dan informasi berguna untuk kucing kesayangan Anda
              </p>
            </div>
            <Link 
              href="/blog" 
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold group flex-shrink-0"
            >
              <span className="leading-none">Lihat Semua</span>
              <AppIcon icon={ArrowRight} size="sm" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Blog Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Cara Memilih Makanan Kucing yang Tepat',
                excerpt: 'Tips memilih nutrisi terbaik untuk kesehatan dan pertumbuhan kucing Anda',
                image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=600&auto=format&fit=crop',
                category: 'Nutrisi',
                date: '15 Feb 2026'
              },
              {
                title: 'Panduan Grooming Kucing di Rumah',
                excerpt: 'Langkah-langkah mudah merawat bulu dan kebersihan kucing kesayangan',
                image: 'https://images.unsplash.com/photo-1416717212458-a071023a70d4?w=600&auto=format&fit=crop',
                category: 'Perawatan',
                date: '12 Feb 2026'
              },
              {
                title: 'Tanda-tanda Kucing Sehat dan Bahagia',
                excerpt: 'Kenali ciri-ciri kucing yang sehat dan cara menjaga kesehatannya',
                image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=600&auto=format&fit=crop',
                category: 'Kesehatan',
                date: '10 Feb 2026'
              },
            ].map((article, idx) => (
              <Link 
                key={idx} 
                href="/blog" 
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-200"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                    <AppIcon icon={Clock} size="xs" />
                    <span className="leading-none">{article.date}</span>
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                    <span className="leading-none">Baca Selengkapnya</span>
                    <AppIcon icon={ArrowRight} size="sm" className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Link */}
          <div className="text-center md:hidden mt-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-base"
            >
              <span className="leading-none">Lihat Semua Artikel</span>
              <AppIcon icon={ArrowRight} size="sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2.5 bg-green-50 text-green-600 rounded-xl font-semibold mb-4 border-2 border-green-100">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Ada Pertanyaan?
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              {
                q: 'Apa saja layanan yang tersedia di Cikal Pet Care?',
                a: 'Kami menyediakan berbagai layanan seperti grooming, konsultasi kesehatan, penitipan kucing, dan penjualan produk perlengkapan kucing berkualitas. Semua layanan ditangani oleh tim profesional yang berpengalaman.'
              },
              {
                q: 'Bagaimana cara melakukan booking penitipan kucing?',
                a: 'Anda bisa melakukan booking melalui halaman Booking di website kami atau menghubungi kami langsung via WhatsApp. Pilih paket penitipan yang sesuai, isi formulir, dan tim kami akan mengkonfirmasi ketersediaan.'
              },
              {
                q: 'Apakah produk yang dijual dijamin berkualitas?',
                a: 'Ya, semua produk yang kami jual adalah produk berkualitas tinggi dan aman untuk kucing. Kami hanya menjual produk dari brand terpercaya dengan sertifikat resmi.'
              },
              {
                q: 'Berapa lama proses grooming kucing?',
                a: 'Proses grooming biasanya memakan waktu 2-3 jam tergantung jenis layanan yang dipilih dan kondisi bulu kucing. Kami memastikan kucing Anda mendapat perawatan yang teliti dan nyaman.'
              },
              {
                q: 'Apakah ada jaminan uang kembali?',
                a: 'Kami memberikan jaminan kepuasan pelanggan. Jika ada masalah dengan produk atau layanan, silakan hubungi kami dalam 24 jam untuk solusi terbaik.'
              },
            ].map((faq, idx) => (
              <details 
                key={idx} 
                className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-green-200"
              >
                <summary className="cursor-pointer p-5 md:p-6 font-bold text-base text-gray-900 flex items-center justify-between group-hover:text-green-600 transition-colors">
                  <span className="flex-1 pr-4">{faq.q}</span>
                  <AppIcon icon={ArrowRight} size="sm" className="text-green-600 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 pt-2 md:px-6 md:pb-6 text-sm md:text-base text-gray-600 border-t-2 border-gray-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10 md:mt-12 p-6 md:p-8 bg-green-50 rounded-2xl border-2 border-green-200">
            <p className="text-base md:text-lg text-gray-700 mb-3">
              Masih ada pertanyaan? <span className="font-bold">Hubungi kami sekarang!</span>
            </p>
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold"
            >
              <span className="leading-none">Lihat Semua Blog</span>
              <AppIcon icon={ArrowRight} size="md" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          CONTACT INFO SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold mb-4 border-2 border-blue-200">
              Kunjungi Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Lokasi & Kontak
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Kami siap melayani Anda setiap hari
            </p>
          </div>
          
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Alamat Kami',
                info: 'Jl. Kemakmuran, Kelurahan Manding, Kecamatan Polewali',
                subinfo: 'Polewali Mandar, Sulawesi Barat',
                color: 'blue',
                link: 'https://maps.google.com'
              },
              {
                icon: Phone,
                title: 'Hubungi Kami',
                info: '+62 852-5547-8706',
                subinfo: 'Senin - Minggu: 08.00 - 20.00 WITA',
                color: 'green',
                link: 'tel:+6285255478706'
              },
              {
                icon: Mail,
                title: 'Email Kami',
                info: 'info@cikalpetcare.com',
                subinfo: 'Respon dalam 24 jam',
                color: 'purple',
                link: 'mailto:info@cikalpetcare.com'
              },
            ].map((contact, idx) => (
              <a
                key={idx}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 text-center"
              >
                <div className={`w-16 h-16 bg-${contact.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <AppIcon icon={contact.icon} size="lg" className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{contact.title}</h3>
                <p className="text-base font-semibold text-blue-600 mb-2">{contact.info}</p>
                <p className="text-sm text-gray-600">{contact.subinfo}</p>
              </a>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 md:mt-16 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <div className="bg-blue-50 h-64 flex items-center justify-center">
              <div className="text-center">
                <AppIcon icon={MapPin} size="2xl" className="text-blue-600 mx-auto mb-3" />
                <p className="text-lg font-bold text-gray-900 mb-2">Peta Lokasi</p>
                <p className="text-sm text-gray-600">Coming Soon - Integrasi Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FINAL CTA SECTION
          ======================================== */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <AppIcon icon={Sparkles} size="lg" className="text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
            Mulai Perjalanan Perawatan Kucing Terbaik Hari Ini!
          </h2>
          
          {/* Description */}
          <p className="text-base text-blue-50 mb-8 max-w-3xl mx-auto">
            Bergabunglah dengan ratusan pemilik kucing yang mempercayakan kesehatan dan kebahagiaan kucing mereka kepada kami. 
            <span className="font-bold text-white"> Dapatkan konsultasi gratis sekarang!</span>
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 max-w-2xl mx-auto">
            <Link 
              href="/booking" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <AppIcon icon={Bed} size="sm" />
              <span className="leading-none">Booking Sekarang</span>
              <AppIcon icon={ArrowRight} size="sm" className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/kontak" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-800/50 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-blue-800/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <AppIcon icon={MessageSquare} size="sm" />
              <span className="leading-none">Chat dengan Kami</span>
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 text-white/90 max-w-3xl mx-auto">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <AppIcon icon={Check} size="sm" />
              <span className="leading-none">Konsultasi Gratis</span>
            </span>
            <span className="flex items-center gap-2 font-semibold text-sm">
              <AppIcon icon={Check} size="sm" />
              <span className="leading-none">Tim Berpengalaman</span>
            </span>
            <span className="flex items-center gap-2 font-semibold text-sm">
              <AppIcon icon={Check} size="sm" />
              <span className="leading-none">Harga Terjangkau</span>
            </span>
            <span className="flex items-center gap-2 font-semibold text-sm">
              <AppIcon icon={Check} size="sm" />
              <span className="leading-none">Garansi Kepuasan</span>
            </span>
          </div>
        </div>
      </section>

    </main>
  )
}
