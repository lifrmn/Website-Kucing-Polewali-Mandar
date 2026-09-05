'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import type { PenitipanPackage } from '@/types'
import { CalendarPlus, Check, Crown, Star, PawPrint, Zap, Home, MessageCircle, X } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppIcon from '@/components/AppIcon'
import { useSiteSettings } from '@/components/SiteSettingsContext'
import { toWhatsAppNumber } from '@/lib/whatsapp'

export default function BookingPage() {
  const settings = useSiteSettings()
  const [packages, setPackages] = useState<PenitipanPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<PenitipanPackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingResult, setBookingResult] = useState<{
    booking_number: string
    total_nights: number
    total_price: number
  } | null>(null)
  const idempotencyKey = useRef('')

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

  const minimumBookingDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const openBooking = (pkg: PenitipanPackage) => {
    idempotencyKey.current = crypto.randomUUID()
    setBookingError('')
    setBookingResult(null)
    setSelectedPackage(pkg)
  }

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPackage) return
    setSubmitting(true)
    setBookingError('')

    try {
      const formData = new FormData(event.currentTarget)
      const payload = Object.fromEntries(formData.entries())
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current,
        },
        body: JSON.stringify({ ...payload, package_id: selectedPackage.id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setBookingError(data.error || 'Booking belum dapat dibuat')
        return
      }
      setBookingResult(data.data)
    } catch {
      setBookingError('Koneksi bermasalah. Silakan coba lagi dengan data yang sama.')
    } finally {
      setSubmitting(false)
    }
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
                href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`}
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
            {packages.map((pkg) => {
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

                    <button
                      type="button"
                      onClick={() => openBooking(pkg)}
                      className="w-full py-3 px-5 text-white font-bold rounded-xl transition-opacity duration-300 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:opacity-90"
                      style={{ backgroundColor: '#E6D18B' }}
                    >
                      <AppIcon icon={CalendarPlus} size="sm" />
                      <span className="leading-none">Booking Sekarang</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4" style={{ borderColor: '#E8E3DA' }}>
              <div>
                <h2 id="booking-title" className="text-xl font-bold" style={{ color: '#383838' }}>Booking {selectedPackage.name}</h2>
                <p className="text-sm" style={{ color: '#707070' }}>{formatCurrency(selectedPackage.price_per_night)} per malam</p>
              </div>
              <button type="button" onClick={() => setSelectedPackage(null)} className="p-2 rounded-full hover:bg-stone-100" aria-label="Tutup form booking">
                <AppIcon icon={X} size="sm" />
              </button>
            </div>

            {bookingResult ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <AppIcon icon={Check} size="lg" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#383838' }}>Booking berhasil diterima</h3>
                <p className="text-sm mb-5" style={{ color: '#707070' }}>Simpan nomor booking untuk konfirmasi dengan tim kami.</p>
                <p className="font-mono text-xl font-bold mb-2" style={{ color: '#B66D6D' }}>{bookingResult.booking_number}</p>
                <p className="text-sm" style={{ color: '#707070' }}>{bookingResult.total_nights} malam · {formatCurrency(bookingResult.total_price)}</p>
                <button type="button" onClick={() => setSelectedPackage(null)} className="mt-7 px-6 py-3 rounded-xl font-semibold" style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}>Selesai</button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="p-5 md:p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm font-medium">Nama pelanggan<input name="customer_name" required minLength={2} maxLength={100} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Nomor WhatsApp<input name="customer_phone" required inputMode="tel" placeholder="081234567890" className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium md:col-span-2">Email (opsional)<input name="customer_email" type="email" maxLength={254} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Tanggal check-in<input name="check_in_date" type="date" required min={minimumBookingDate} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Tanggal check-out<input name="check_out_date" type="date" required min={minimumBookingDate} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Nama kucing<input name="cat_name" required maxLength={100} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Usia kucing<input name="cat_age" maxLength={50} placeholder="Contoh: 2 tahun" className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium">Jenis kelamin<select name="cat_gender" className="mt-1 w-full rounded-lg border px-3 py-2.5"><option value="">Pilih</option><option value="Jantan">Jantan</option><option value="Betina">Betina</option></select></label>
                  <label className="text-sm font-medium">Ras (opsional)<input name="cat_breed" maxLength={100} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                  <label className="text-sm font-medium md:col-span-2">Kondisi kesehatan<textarea name="cat_health_condition" maxLength={1000} rows={2} className="mt-1 w-full rounded-lg border px-3 py-2.5 resize-none" /></label>
                  <label className="text-sm font-medium md:col-span-2">Permintaan khusus<textarea name="special_requests" maxLength={1000} rows={2} className="mt-1 w-full rounded-lg border px-3 py-2.5 resize-none" /></label>
                  <label className="text-sm font-medium md:col-span-2">Kontak darurat<input name="emergency_contact" maxLength={100} className="mt-1 w-full rounded-lg border px-3 py-2.5" /></label>
                </div>
                {bookingError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{bookingError}</p>}
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setSelectedPackage(null)} className="px-5 py-2.5 rounded-xl border font-semibold">Batal</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl font-semibold disabled:opacity-60" style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}>{submitting ? 'Memproses...' : 'Kirim Booking'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
