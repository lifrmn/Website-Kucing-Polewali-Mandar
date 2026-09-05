'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Loader2, Package, Search, Truck } from 'lucide-react'

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

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<CustomerOrderSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const number = new URLSearchParams(window.location.search).get('order') || ''
    if (!number) return
    setOrderNumber(number)
    setPhone(sessionStorage.getItem(`order-phone:${number}`) || '')
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
      </div>
    </main>
  )
}