'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { orderService } from '@/services/orderService'
import { toast } from 'react-toastify'
import { Loader2, ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    payment_method: 'qris',
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Keranjang belanja kosong!')
      return
    }

    // Form validation
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi!')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Nomor telepon harus diisi!')
      return
    }

    if (!formData.address.trim()) {
      toast.error('Alamat harus diisi!')
      return
    }

    // Validate phone number format (Indonesian phone numbers)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast.error('Format nomor telepon tidak valid!')
      return
    }

    // Validate email format if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Format email tidak valid!')
        return
      }
    }

    setLoading(true)

    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        order_type: 'product' as const,
        items: items.map((item) => ({
          item_type: item.type as 'product' | 'service',
          item_id: item.id,
          item_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        payment_method: formData.payment_method as 'qris' | 'transfer',
        notes: formData.notes,
      }

      const result = await orderService.createOrder(orderData)

      if (result.success && result.data) {
        toast.success('Pesanan berhasil dibuat!')
        clearCart()
        router.push(`/cara-pembayaran?order=${result.data.order_number}`)
      } else {
        toast.error(result.error || 'Gagal membuat pesanan')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Terjadi kesalahan saat checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-indigo-50">
        <div className="text-center animate-fadeInUp">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-20 h-20 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-8">
              Keranjang belanja Anda masih kosong. Yuk mulai belanja untuk kucing kesayangan!
            </p>
            <button
              onClick={() => router.push('/produk')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              🛍️ Belanja Sekarang
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block px-5 py-2.5 bg-blue-50 rounded-full mb-4 border-2 border-blue-100">
            <span className="text-sm font-semibold text-blue-600">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Selesaikan Pesanan
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-6 border-2 border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg">📄</span>
                <span>Informasi Pembeli</span>
              </h2>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300"
                  placeholder="Alamat lengkap pengiriman"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300 font-semibold bg-white"
                >
                  <option value="qris">📱 QRIS</option>
                  <option value="transfer">🏦 Transfer Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Catatan (Opsional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input-enhanced w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-lg transition-all duration-300"
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Buat Pesanan</span>
                )}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-24 border-2 border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg">📭</span>
                <span>Ringkasan Pesanan</span>
              </h2>              
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div 
                    key={`${item.type}-${item.id}`} 
                    className="flex justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 group"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold">
                          {item.quantity}x
                        </span>
                        <span className="ml-2">{formatCurrency(item.price)}</span>
                      </p>
                    </div>
                    <p className="font-bold text-primary-600 text-lg">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-primary-200 pt-6">
                <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl">
                  <span className="text-lg font-bold text-gray-800">Total Pembayaran:</span>
                  <span className="text-3xl font-bold text-gradient-primary">
                    {formatCurrency(getTotal())}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-700 text-center font-semibold">
                    🔒 Pembayaran aman dan terpercaya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
