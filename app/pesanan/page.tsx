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
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, text: 'Menunggu' },
      confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: CheckCircle, text: 'Dikonfirmasi' },
      processing: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Clock, text: 'Diproses' },
      completed: { color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Selesai' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, text: 'Dibatalkan' },
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${badge.color}`}>
        <AppIcon icon={badge.icon} size="sm" />
        <span className="leading-none">{badge.text}</span>
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-700 border border-yellow-300', text: '⏳ Belum Bayar' },
      paid: { color: 'bg-green-100 text-green-700 border border-green-300', text: '✅ Lunas' },
      failed: { color: 'bg-red-100 text-red-700 border border-red-300', text: '❌ Gagal' },
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
            <Loader2 className="animate-spin w-20 h-20 text-blue-600 mx-auto relative" />
          </div>
          <div className="space-y-3">
            <p className="text-2xl text-gray-800 font-bold">Memuat pesanan Anda...</p>
            <p className="text-base text-gray-500">Sedang mengambil data pesanan</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold border-2 border-blue-100 mb-5">
            <AppIcon icon={ShoppingBag} size="sm" />
            <span className="leading-none">Riwayat Pesanan</span>
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-gray-900">
            Pesanan Saya
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Lacak dan kelola semua pesanan Anda di sini
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-md p-8 border-2 border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search Box */}
              <div className="relative">
                <div className="absolute pointer-events-none" style={{left: '16px', top: '50%', transform: 'translateY(-50%)'}}>
                  <AppIcon icon={Search} size="sm" className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nomor pesanan, nama, atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all duration-300 text-base"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white font-bold text-gray-700 text-base"
                >
                  <option value="all">📋 Semua Status</option>
                  <option value="pending">⏳ Menunggu</option>
                  <option value="confirmed">✅ Dikonfirmasi</option>
                  <option value="processing">⚙️ Diproses</option>
                  <option value="completed">🎉 Selesai</option>
                  <option value="cancelled">❌ Dibatalkan</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-center bg-blue-50 rounded-xl py-4 border border-blue-100">
              <p className="text-base text-gray-600">
                Menampilkan <span className="font-bold text-blue-600 text-lg">{filteredOrders.length}</span> dari <span className="font-bold text-lg">{orders.length}</span> pesanan
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-7xl">🛍️</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Belum Ada Pesanan</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Anda belum memiliki pesanan. Yuk belanja sekarang!
              </p>
              <a
                href="/produk"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <AppIcon icon={ShoppingBag} size="sm" />
                <span className="leading-none">Belanja Sekarang</span>
              </a>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200">
              <div className="w-28 h-28 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">🔍</span>
              </div>
              <p className="text-gray-800 text-2xl font-bold mb-4">Pesanan tidak ditemukan</p>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Coba ubah kata kunci pencarian atau filter status
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <AppIcon icon={RotateCcw} size="sm" />
                <span className="leading-none">Reset Filter</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border-2 border-gray-100 hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">#{order.order_number}</h3>
                      {getStatusBadge(order.order_status)}
                      {getPaymentBadge(order.payment_status)}
                    </div>
                    <div className="space-y-2 text-base text-gray-600">
                      <p><span className="font-bold text-gray-800">Nama:</span> {order.customer_name}</p>
                      <p><span className="font-bold text-gray-800">Email:</span> {order.customer_email}</p>
                      <p><span className="font-bold text-gray-800">Telepon:</span> {order.customer_phone}</p>
                      <p><span className="font-bold text-gray-800">Tanggal:</span> {formatDate(order.created_at)}</p>
                      <p><span className="font-bold text-gray-800">Pembayaran:</span> {order.payment_method.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="text-center lg:text-right">
                    <p className="text-base text-gray-600 mb-2">Total Pembayaran</p>
                    <p className="text-4xl font-bold text-blue-600 mb-6">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <a
                      href={`/cara-pembayaran?order=${order.order_number}`}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <AppIcon icon={Eye} size="sm" />
                      <span className="leading-none">Lihat Detail</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
