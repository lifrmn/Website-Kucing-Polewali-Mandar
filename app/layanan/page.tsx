'use client'

import { useEffect, useState } from 'react'
import { serviceService } from '@/services/serviceService'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-toastify'
import { Clock, ShoppingCart, Search, Scissors, Stethoscope, Home, Sparkles } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppIcon from '@/components/AppIcon'

interface Service {
  id: string
  name: string
  description: string | null
  type: string
  duration: number | null
  price: number
  is_active: boolean
}

const SERVICE_IMAGES: Record<string, string> = {
  grooming: 'https://images.unsplash.com/photo-1585289167915-67cfeb4e6b52?w=600&auto=format&fit=crop',
  medical: 'https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=600&auto=format&fit=crop',
  boarding: 'https://images.unsplash.com/photo-1573865526739-10c1dd7db5d8?w=600&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SERVICE_ICONS: Record<string, any> = {
  grooming: Scissors,
  medical: Stethoscope,
  boarding: Home,
  default: Sparkles
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    const response = await serviceService.getServices()
    if (response.success && response.data) {
      setServices(response.data)
      setFilteredServices(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let filtered = [...services]
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(service => service.type === typeFilter)
    }
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
    setFilteredServices(filtered)
  }, [searchQuery, typeFilter, sortBy, services])

  const serviceTypes = ['all', ...new Set(services.map(s => s.type).filter(Boolean))]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (service: Service) => {
    addItem({
      id: service.id,
      type: 'service',
      name: service.name,
      price: service.price,
      description: service.description,
    })
    toast.success(`${service.name} ditambahkan ke keranjang!`)
    openCart()
  }

  const getServiceImage = (type: string) => SERVICE_IMAGES[type] || SERVICE_IMAGES.default
  const getServiceIcon = (type: string) => SERVICE_ICONS[type] || SERVICE_ICONS.default

  if (loading) {
    return (
      <LoadingSpinner
        message="Memuat layanan..."
        submessage="Menyiapkan data layanan"
        variant="green"
      />
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Layanan Perawatan Kucing
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Layanan kesehatan dan perawatan profesional untuk kucing kesayangan Anda
          </p>
        </div>
        {/* Wave bottom */}
        <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 md:py-8 bg-white border-b sticky top-20 z-20" style={{ borderColor: '#E8E3DA' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <AppIcon icon={Search} size="sm" className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 border rounded-full focus:ring-2 focus:border-transparent transition-colors text-sm md:text-base"
              style={{ borderColor: '#E8E3DA', outlineColor: '#E6D18B' }}
              />
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                title={typeFilter === 'all' ? 'Semua Tipe' : serviceTypes.find(t => t === typeFilter) || ''}
                className="flex-1 sm:flex-initial sm:min-w-[220px] px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-sm md:text-base truncate"
              >
                <option value="all">Semua Tipe</option>
                {serviceTypes.filter(t => t !== 'all').map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title={sortBy === 'name' ? 'Nama (A-Z)' : sortBy === 'price-asc' ? 'Harga: Terendah' : 'Harga: Tertinggi'}
                className="flex-1 sm:flex-initial sm:min-w-[220px] px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-sm md:text-base truncate"
              >
                <option value="name">Nama (A-Z)</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-500">
            Menampilkan {filteredServices.length} dari {services.length} layanan
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AppIcon icon={Sparkles} size="2xl" className="text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">Belum ada layanan tersedia</p>
              <p className="text-slate-500">Pastikan database sudah disetup dengan benar</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AppIcon icon={Search} size="2xl" className="text-amber-500" />
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">Layanan tidak ditemukan</p>
              <p className="text-slate-500 mb-6">Coba ubah kata kunci atau filter</p>
              <button
                onClick={() => { setSearchQuery(''); setTypeFilter('all'); setSortBy('name'); }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white transition-all duration-300 hover:-translate-y-2"
                  style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
                >
                  {/* Image */}
                  <div className="relative h-44 md:h-48 overflow-hidden">
                    <img
                      src={getServiceImage(service.type)}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center" style={{ color: '#B66D6D' }}>
                        <AppIcon icon={getServiceIcon(service.type)} size="sm" />
                      </div>
                      <span className="px-2.5 py-1 md:px-3 md:py-1 bg-white/90 text-[10px] md:text-xs font-semibold rounded-full uppercase leading-none" style={{ color: '#383838' }}>
                        {service.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {service.name}
                    </h3>
                    
                    {service.duration && (
                      <div className="flex items-center gap-2 text-slate-500 mb-3">
                        <AppIcon icon={Clock} size="sm" />
                        <span className="text-xs md:text-sm leading-none">{service.duration} menit</span>
                      </div>
                    )}

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                      {service.description || 'Layanan profesional untuk kucing Anda'}
                    </p>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-100">
                      <span className="text-lg md:text-xl font-bold" style={{ color: '#E6D18B' }}>
                        {formatCurrency(service.price)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(service)}
                        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}
                      >
                        <AppIcon icon={ShoppingCart} size="sm" />
                        <span className="leading-none">Tambah</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
