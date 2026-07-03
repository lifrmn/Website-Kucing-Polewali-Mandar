'use client'

import { useEffect, useState } from 'react'
import type { PenitipanPackage } from '@/types'
import { Check, Crown, Star, PawPrint, Zap, Home, MessageCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppIcon from '@/components/AppIcon'

export default function BookingPage() {
  const [packages, setPackages] = useState<PenitipanPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/packages')
      const data = await response.json()
      if (data.success && data.data) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error('Error loading packages:', error)
    }
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <LoadingSpinner
        message="Memuat paket penitipan..."
        submessage="Menyiapkan penginapan terbaik untuk kucing Anda"
        variant="purple"
      />
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Paket Penitipan Kucing
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Pilih paket terbaik untuk kenyamanan dan keamanan kucing kesayangan Anda
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
        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-[20px] p-12 shadow-md border-2" style={{ borderColor: '#E8E3DA' }}>
              <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FAF8F5' }}>
                <AppIcon icon={Home} size="2xl" style={{ color: '#E6D18B' }} />
              </div>
              <p className="text-xl font-bold mb-3" style={{ color: '#383838' }}>Belum ada paket penitipan tersedia</p>
              <p className="text-sm mb-6" style={{ color: '#707070' }}>
                Silakan hubungi kami untuk informasi lebih lanjut
              </p>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#E6D18B' }}
              >
                <AppIcon icon={MessageCircle} size="sm" />
                <span className="leading-none">Hubungi WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, index) => {
              const getTierStyle = () => {
                if (pkg.name.toLowerCase().includes('premium') || pkg.name.toLowerCase().includes('vip')) {
                  return {
                    badgeColor: '#E6D18B',
                    icon: Crown,
                    popular: true,
                    image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=600&auto=format&fit=crop'
                  };
                } else if (pkg.name.toLowerCase().includes('standar') || pkg.name.toLowerCase().includes('standard')) {
                  return {
                    badgeColor: '#E6D18B',
                    icon: Star,
                    popular: false,
                    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop'
                  };
                } else if (pkg.name.toLowerCase().includes('deluxe')) {
                  return {
                    badgeColor: '#E6D18B',
                    icon: Zap,
                    popular: false,
                    image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&auto=format&fit=crop'
                  };
                } else {
                  return {
                    badgeColor: '#E6D18B',
                    icon: PawPrint,
                    popular: false,
                    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop'
                  };
                }
              };

              const tierStyle = getTierStyle();

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:scale-105"
                  style={{ borderColor: '#E8E3DA' }}
                >
                  {/* Package Image Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tierStyle.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}></div>
                    
                    {/* Tier Badge on Image */}
                    <div className="absolute top-3 right-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-[15px] text-white shadow-md border-2 border-white/50" style={{ backgroundColor: tierStyle.badgeColor }}>
                        <AppIcon icon={tierStyle.icon} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Popular Badge */}
                  {tierStyle.popular && (
                    <div className="text-center py-2" style={{ backgroundColor: '#E6D18B', color: 'white' }}>
                      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider">
                        <AppIcon icon={Zap} size="xs" />
                        <span className="leading-none">TERPOPULER</span>
                      </span>
                    </div>
                  )}
                  
                  {/* Content Container */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#383838' }}>
                      {pkg.name}
                    </h3>
                    
                    <div className="mb-6">
                      <span className="text-3xl font-bold" style={{ color: '#E6D18B' }}>
                        {formatCurrency(pkg.price_per_night)}
                      </span>
                      <p className="text-sm mt-2" style={{ color: '#707070' }}>per malam</p>
                    </div>

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="text-left space-y-3 mb-6 rounded-[15px] p-5 border-2" style={{ backgroundColor: '#FAF8F5', borderColor: '#E8E3DA' }}>
                        {pkg.features.map((feature: string, featureIndex: number) => (
                          <li 
                            key={featureIndex} 
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <div className="mt-0.5 rounded-full p-1 flex-shrink-0" style={{ backgroundColor: tierStyle.badgeColor }}>
                              <AppIcon icon={Check} size="xs" className="text-white" />
                            </div>
                            <span style={{ color: '#383838' }} className="leading-none">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Halo, saya tertarik dengan paket ${pkg.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-5 text-white font-bold rounded-xl transition-opacity duration-300 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:opacity-90"
                      style={{ backgroundColor: '#E6D18B' }}
                    >
                      <AppIcon icon={MessageCircle} size="sm" />
                      <span className="leading-none">Booking Sekarang</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  )
}
