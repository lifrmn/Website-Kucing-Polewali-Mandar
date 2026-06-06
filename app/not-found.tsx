'use client'

import Link from 'next/link'
import { Home, Cat } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounceSlow"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounceSlow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-48 h-48 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounceSlow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container text-center relative z-10">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl animate-fadeInUp">
          {/* Cat Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-2xl opacity-50 animate-pulse-custom"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <Cat className="w-20 h-20 text-purple-600 animate-bounceSlow" />
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-8xl font-black mb-4" style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            404
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Sepertinya kucing nakal telah menyembunyikan halaman yang Anda cari. 😿<br/>
            Mari kembali ke beranda dan temukan hal menarik lainnya!
          </p>
          
          {/* Suggested Links */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link 
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Link>
            <Link 
              href="/produk"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-purple-200"
            >
              🛍️ Lihat Produk
            </Link>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div>
              <p className="text-3xl font-bold text-purple-600">100+</p>
              <p className="text-sm text-gray-600">Produk</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600">24/7</p>
              <p className="text-sm text-gray-600">Layanan</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">⭐ 5.0</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
