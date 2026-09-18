'use client'

import { FormEvent, useEffect, useState } from 'react'
import { CalendarDays, Loader2, Package, Search, Truck, Upload } from 'lucide-react'

import AppIcon from '@/components/AppIcon'
import { CustomerOrderSummary, orderService } from '@/services/orderService'

const statusLabels: Record<string, string> = {
  PENDING: 'Menunggu pembayaran',
  WAITING_VERIFICATION: 'Menunggu verifikasi',
  PAID: 'Pembayaran diterima',
  PROCESSING: 'Sedang diproses',
  SHIPPED: 'Sedang dikirim',
  COMPLETED: 'Selesai',
  CANCELED: 'Dibatalkan',
  REFUNDED: 'Dana dikembalikan',
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-[#FEF3C7] text-[#92400E]',
  WAITING_VERIFICATION: 'bg-[#FEF3C7] text-[#92400E]',
  PAID: 'bg-[#DCFCE7] text-[#166534]',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-[#DCFCE7] text-[#166534]',
  CANCELED: 'bg-[#FEE2E2] text-[#B91C1C]',
  REFUNDED: 'bg-[#FEF3C7] text-[#92400E]',
}

interface CustomerBookingSummary {
  booking_number: string
  cat_name: string
  cat_count: number
  check_in_date: string
  check_out_date: string
  total_nights: number
  total_price: number
  status: string
  payment_status: string
  payment_method: string
  deposit_amount: number
  package: { name: string }
}

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<CustomerOrderSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingNumber, setBookingNumber] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [booking, setBooking] = useState<CustomerBookingSummary | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingProofFile, setBookingProofFile] = useState<File | null>(null)
  const [bookingUploading, setBookingUploading] = useState(false)
  const [bookingPaymentFeedback, setBookingPaymentFeedback] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const number = searchParams.get('order') || ''
    if (number) {
      setOrderNumber(number)
      setPhone(sessionStorage.getItem(`order-phone:${number}`) || '')
    }
    const bookingReference = searchParams.get('booking') || ''
    if (bookingReference) {
      setBookingNumber(bookingReference)
      setBookingPhone(sessionStorage.getItem(`booking-phone:${bookingReference}`) || '')
    }
  }, [])

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    const response = await orderService.lookupCustomerOrder(orderNumber, phone)
    if (response.success && response.data) {
      setOrder(response.data)
      sessionStorage.setItem(`order-phone:${response.data.order_number}`, phone.replace(/\s+/g, ''))
    } else {
      setError(response.error || 'Pesanan tidak ditemukan')
    }
    setLoading(false)
  }

  const handleBookingLookup = async (event: FormEvent) => {
    event.preventDefault()
    setBookingLoading(true)
    setBookingError('')
    setBookingPaymentFeedback('')
    setBooking(null)
    try {
      const response = await fetch('/api/bookings/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_number: bookingNumber, customer_phone: bookingPhone }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setBookingError(data.error || 'Booking tidak ditemukan')
        return
      }
      setBooking(data.data)
      sessionStorage.setItem(`booking-phone:${data.data.booking_number}`, bookingPhone.replace(/\s+/g, ''))
    } catch {
      setBookingError('Terjadi kendala saat memeriksa booking. Silakan coba kembali.')
    } finally {
      setBookingLoading(false)
    }
  }

  const uploadBookingProof = async (event: FormEvent) => {
    event.preventDefault()
    if (!booking || !bookingProofFile) return
    setBookingUploading(true)
    setBookingPaymentFeedback('')
    const formData = new FormData()
    formData.set('booking_number', booking.booking_number)
    formData.set('customer_phone', bookingPhone)
    formData.set('file', bookingProofFile)
    try {
      const response = await fetch('/api/bookings/customer', { method: 'PUT', body: formData })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setBookingPaymentFeedback(data.error || 'Bukti pembayaran gagal dikirim')
        return
      }
      setBooking(data.data)
      setBookingProofFile(null)
      setBookingPaymentFeedback(data.message)
    } catch {
      setBookingPaymentFeedback('Koneksi bermasalah. Silakan coba kembali.')
    } finally {
      setBookingUploading(false)
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Cek Pesanan</h1>
          <p className="text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>Pantau pembayaran, proses, dan pengiriman pesanan Anda</p>
        </div>
        <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-14 md:py-20 space-y-6">
        <form onSubmit={handleLookup} className="bg-white rounded-[20px] shadow-md border-2 p-6 md:p-8" style={{ borderColor: '#E8E3DA' }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#383838' }}>Nomor Pesanan</label>
              <input
                required
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="INV-..."
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#383838' }}>Nomor Telepon</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="08xxxxxxxxxx"
                className="input-premium"
              />
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#E6D18B', color: '#2a2a1a' }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AppIcon icon={Search} size="sm" />}
            Periksa Pesanan
          </button>
        </form>

        {order && (
          <section className="bg-white rounded-[20px] shadow-md border-2 p-6 md:p-8 space-y-6" style={{ borderColor: '#E8E3DA' }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: '#707070' }}>Nomor Pesanan</p>
                <h2 className="text-xl font-bold" style={{ color: '#383838' }}>{order.order_number}</h2>
              </div>
              <span className={`self-start rounded-full px-3 py-1.5 text-sm font-semibold ${statusStyles[order.status] || 'bg-surface2 text-text'}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 py-5 border-y" style={{ borderColor: '#E8E3DA' }}>
              <div><p className="text-xs text-slate-500">Total</p><p className="font-bold">{formatCurrency(order.total_amount)}</p></div>
              <div><p className="text-xs text-slate-500">Pembayaran</p><p className="font-bold">{order.payment_status.replace(/_/g, ' ')}</p></div>
              <div><p className="text-xs text-slate-500">Metode</p><p className="font-bold">{order.payment_method.replace(/_/g, ' ')}</p></div>
            </div>

            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2"><Package className="w-5 h-5" /> Item Pesanan</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm py-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.tracking_number && (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-surface2 p-4">
                <Truck className="mt-0.5 h-5 w-5 text-dark-gold" />
                <div><p className="text-sm text-muted">Nomor Resi</p><p className="font-mono font-bold text-text">{order.tracking_number}</p></div>
              </div>
            )}
          </section>
        )}

        <form onSubmit={handleBookingLookup} className="rounded-[20px] border-2 bg-white p-6 shadow-md md:p-8" style={{ borderColor: '#E8E3DA' }}>
          <div className="mb-5 flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-dark-gold" aria-hidden="true" />
            <div><h2 className="font-bold text-text">Cek Booking Penitipan</h2><p className="text-sm text-muted">Gunakan nomor booking dan telepon yang didaftarkan.</p></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-text">Nomor Booking<input required value={bookingNumber} onChange={(event) => setBookingNumber(event.target.value)} placeholder="BOK-..." className="input-premium mt-2" /></label>
            <label className="block text-sm font-semibold text-text">Nomor Telepon<input required type="tel" value={bookingPhone} onChange={(event) => setBookingPhone(event.target.value)} placeholder="08xxxxxxxxxx" className="input-premium mt-2" /></label>
          </div>
          {bookingError && <p role="alert" className="mt-4 text-sm text-red-600">{bookingError}</p>}
          <button type="submit" disabled={bookingLoading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-[#2a2a1a] disabled:opacity-50">
            {bookingLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <AppIcon icon={Search} size="sm" />}
            Periksa Booking
          </button>
        </form>

        {booking && (
          <section className="space-y-5 rounded-[20px] border-2 bg-white p-6 shadow-md md:p-8" style={{ borderColor: '#E8E3DA' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="text-sm text-muted">Nomor Booking</p><h2 className="text-xl font-bold text-text">{booking.booking_number}</h2></div>
              <span className={`self-start rounded-full px-3 py-1.5 text-sm font-semibold ${statusStyles[booking.status] || 'bg-surface2 text-text'}`}>{statusLabels[booking.status] || booking.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2">
              <div><p className="text-xs text-muted">Paket</p><p className="font-bold text-text">{booking.package.name}</p></div>
              <div><p className="text-xs text-muted">Kucing</p><p className="font-bold text-text">{booking.cat_name} ({booking.cat_count})</p></div>
              <div><p className="text-xs text-muted">Check-in</p><p className="font-bold text-text">{new Date(booking.check_in_date).toLocaleDateString('id-ID', { dateStyle: 'long', timeZone: 'UTC' })}</p></div>
              <div><p className="text-xs text-muted">Check-out</p><p className="font-bold text-text">{new Date(booking.check_out_date).toLocaleDateString('id-ID', { dateStyle: 'long', timeZone: 'UTC' })}</p></div>
            </div>
            <div className="grid gap-3 rounded-button border border-border bg-surface2 p-4 sm:grid-cols-3"><div><p className="text-xs text-muted">Total</p><strong className="text-text">{formatCurrency(booking.total_price)}</strong></div><div><p className="text-xs text-muted">Metode</p><strong className="text-text">{booking.payment_method.replace(/_/g, ' ')}</strong></div><div><p className="text-xs text-muted">{booking.payment_method === 'COD' ? 'Dibayar di lokasi' : 'DP'}</p><strong className="text-dark-gold">{booking.payment_method === 'COD' ? formatCurrency(booking.total_price) : formatCurrency(booking.deposit_amount)}</strong></div></div>
            <p className="text-sm text-muted">{booking.total_nights} malam · Pembayaran {booking.payment_status.replace(/_/g, ' ')}</p>
            {booking.payment_method !== 'COD' && !['PAID'].includes(booking.payment_status) && !['CANCELED', 'COMPLETED'].includes(booking.status) && (
              <form onSubmit={uploadBookingProof} className="rounded-card border border-border p-4">
                <h3 className="flex items-center gap-2 font-bold text-text"><Upload className="h-5 w-5 text-dark-gold" /> Unggah Bukti Pembayaran</h3>
                <p className="mt-1 text-sm text-muted">JPG, PNG, atau WebP, maksimal 5MB.</p>
                <input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setBookingProofFile(event.target.files?.[0] || null)} className="mt-3 block w-full rounded-button border border-border p-3 text-sm" />
                <button type="submit" disabled={bookingUploading || !bookingProofFile} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-button bg-primary font-semibold text-[#2a2a1a] disabled:opacity-50">{bookingUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}Kirim untuk Verifikasi</button>
              </form>
            )}
            {booking.payment_method === 'COD' && <p className="rounded-button bg-[#DCFCE7] px-4 py-3 text-sm text-[#166534]">Bayar sesuai total kepada petugas Cikal Pet Care saat check-in. Tidak perlu mengunggah bukti transfer.</p>}
            {bookingPaymentFeedback && <p role="status" className="rounded-button bg-surface2 px-4 py-3 text-sm text-text">{bookingPaymentFeedback}</p>}
          </section>
        )}
      </div>
    </main>
  )
}