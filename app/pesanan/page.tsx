'use client'

import { useEffect, useState } from 'react'
import { orderService } from '@/services/orderService'
import { Loader2, ShoppingBag, Clock, CheckCircle, XCircle, Search, RotateCcw, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import AppIcon from '@/components/AppIcon'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  order_type: string
  total_amount: number
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  created_at: Date | string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const response = await orderService.getOrders()
    if (response.success && response.data) {
      setOrders(response.data.data || [])
      setFilteredOrders(response.data.data || [])
    }
    setLoading(false)
  }

  // Filter orders
  useEffect(() => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredOrders(filtered)
  }, [searchQuery, statusFilter, orders])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: '#FCD34D', text: 'Menunggu' },
      confirmed: { color: '#60A5FA', text: 'Dikonfirmasi' },
      processing: { color: '#A78BFA', text: 'Diproses' },
      completed: { color: '#86EFAC', text: 'Selesai' },
      cancelled: { color: '#F87171', text: 'Dibatalkan' },
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return badge
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
        <div className="text-center">
          <Loader2 className="animate-spin w-16 h-16 mx-auto mb-4" style={{ color: '#E6D18B' }} />
          <p className="text-lg font-medium" style={{ color: '#383838' }}>Memuat pesanan Anda...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Pesanan Saya
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Kelola dan pantau status pesanan Anda
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
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <AppIcon icon={Search} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#707070' }} />
            <input
              type="text"
              placeholder="Cari nomor pesanan atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: '#E8E3DA' }}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-4 py-2 rounded-lg font-semibold transition-all text-sm" 
                style={{
                  backgroundColor: statusFilter === status ? '#E6D18B' : 'white',
                  color: statusFilter === status ? 'white' : '#383838',
                  border: `2px solid ${statusFilter === status ? '#E6D18B' : '#E8E3DA'}`
                }}
              >
                {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto bg-white rounded-[20px] p-12 shadow-md border-2" style={{ borderColor: '#E8E3DA' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FAF8F5' }}>
                <ShoppingBag className="w-10 h-10" style={{ color: '#E6D18B' }} />
              </div>
              <p className="text-lg font-semibold mb-3" style={{ color: '#383838' }}>Tidak ada pesanan</p>
              <p style={{ color: '#707070' }}>Belum ada pesanan yang sesuai dengan filter Anda</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.order_status)
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[20px] shadow-md p-6 border-2 hover:shadow-lg transition-all hover:scale-105"
                  style={{ borderColor: '#E8E3DA' }}
                >
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p style={{ color: '#707070' }} className="text-sm mb-1">Nomor Pesanan</p>
                      <p className="text-lg font-bold" style={{ color: '#383838' }}>{order.order_number}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#707070' }} className="text-sm mb-1">Total</p>
                      <p className="text-lg font-bold" style={{ color: '#E6D18B' }}>{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm" style={{ color: '#707070' }}>
                    <div>
                      <p className="mb-1">Tanggal Pesanan</p>
                      <p style={{ color: '#383838' }}>{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="mb-1">Status Pesanan</p>
                      <span
                        className="inline-block px-3 py-1 rounded-lg text-white text-xs font-bold"
                        style={{ backgroundColor: statusBadge.color }}
                      >
                        {statusBadge.text}
                      </span>
                    </div>
                    <div>
                      <p className="mb-1">Metode Pembayaran</p>
                      <p style={{ color: '#383838' }}>{order.payment_method.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
