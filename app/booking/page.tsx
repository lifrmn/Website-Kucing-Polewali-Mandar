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
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-600 rounded-xl font-semibold mb-5 border-2 border-purple-100">
            <AppIcon icon={Home} size="sm" className="text-purple-600" />
            <span className="leading-none">Penitipan Premium</span>
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-gray-900">
            Paket Penitipan Kucing Terbaik
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            Pilih paket yang sesuai untuk kenyamanan dan keamanan kucing kesayangan Anda
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-2xl p-12 shadow-lg border-2 border-purple-100">
              <div className="w-28 h-28 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AppIcon icon={Home} size="2xl" className="text-purple-600" />
              </div>
              <p className="text-gray-800 text-xl font-bold mb-3">Belum ada paket penitipan tersedia</p>
              <p className="text-sm text-gray-500 mb-6">
                Silakan hubungi kami untuk informasi lebih lanjut
              </p>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <AppIcon icon={MessageCircle} size="sm" />
                <span className="leading-none">Hubungi WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => {
              // Determine package tier styling
              const getTierStyle = () => {
                if (pkg.name.toLowerCase().includes('premium') || pkg.name.toLowerCase().includes('vip')) {
                  return {
                    badgeColor: 'bg-purple-600',
                    gradient: 'from-purple-500 to-pink-500',
                    icon: Crown,
                    popular: true,
                    borderHover: 'hover:border-purple-400',
                    image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=600&auto=format&fit=crop'
                  };
                } else if (pkg.name.toLowerCase().includes('standar') || pkg.name.toLowerCase().includes('standard')) {
                  return {
                    badgeColor: 'bg-primary-600',
                    gradient: 'from-blue-500 to-cyan-500',
                    icon: Star,
                    popular: false,
                    borderHover: 'hover:border-blue-400',
                    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop'
                  };
                } else if (pkg.name.toLowerCase().includes('deluxe')) {
                  return {
                    badgeColor: 'bg-orange-600',
                    gradient: 'from-orange-500 to-amber-500',
                    icon: Zap,
                    popular: false,
                    borderHover: 'hover:border-orange-400',
                    image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=600&auto=format&fit=crop'
                  };
                } else {
                  return {
                    badgeColor: 'bg-indigo-600',
                    gradient: 'from-indigo-500 to-violet-500',
                    icon: PawPrint,
                    popular: false,
                    borderHover: 'hover:border-indigo-400',
                    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop'
                  };
                }
              };

              const tierStyle = getTierStyle();

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 ${tierStyle.borderHover} ${
                    tierStyle.popular ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  {/* Package Image Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tierStyle.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${tierStyle.gradient} opacity-40`}></div>
                    
                    {/* Tier Badge on Image */}
                    <div className="absolute top-3 right-3">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${tierStyle.badgeColor} rounded-2xl text-white shadow-md border-2 border-white/50`}>
                        <AppIcon icon={tierStyle.icon} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Popular Badge */}
                  {tierStyle.popular && (
                    <div className="bg-purple-600 text-white text-center py-2">
                      <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider">
                        <AppIcon icon={Zap} size="xs" />
                        <span className="leading-none">TERPOPULER</span>
                      </span>
                    </div>
                  )}
                  
                  {/* Content Container */}
                  <div className="p-6 text-center">

                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                      {pkg.name}
                    </h3>
                    
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-purple-600">
                        {formatCurrency(pkg.price_per_night)}
                      </span>
                      <p className="text-gray-600 text-sm mt-2">per malam</p>
                    </div>

                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="text-left space-y-3 mb-6 bg-gray-50 rounded-2xl p-5 border-2 border-gray-100">
                        {pkg.features.map((feature: string, featureIndex: number) => (
                          <li 
                            key={featureIndex} 
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <div className={`mt-0.5 ${tierStyle.badgeColor} rounded-full p-1 flex-shrink-0`}>
                              <AppIcon icon={Check} size="xs" className="text-white" />
                            </div>
                            <span className="text-gray-800 leading-none">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Halo, saya tertarik dengan paket ${pkg.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors duration-300 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
    </div>
  )
}
