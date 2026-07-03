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
      <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
        {/* Hero Header */}
        <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
              Keranjang Belanja Kosong
            </h1>
          </div>
          {/* Wave bottom */}
          <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
              <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
            </svg>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 md:py-20 text-center">
          <div className="max-w-md mx-auto bg-white rounded-[20px] p-12 shadow-md border-2" style={{ borderColor: '#E8E3DA' }}>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FAF8F5' }}>
              <ShoppingCart className="w-12 h-12" style={{ color: '#E6D18B' }} />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#383838' }}>Keranjang Kosong</h2>
            <p className="mb-8" style={{ color: '#707070' }}>
              Keranjang belanja Anda masih kosong. Yuk mulai belanja untuk kucing kesayangan!
            </p>
            <button
              onClick={() => router.push('/produk')}
              className="px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: '#E6D18B' }}
            >
              🛍️ Belanja Sekarang
            </button>
          </div>
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
            Selesaikan Pesanan
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Isi informasi Anda untuk menyelesaikan pembelian
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
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-[20px] shadow-md p-8 space-y-6 border-2" style={{ borderColor: '#E8E3DA' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#383838' }}>Informasi Pembeli</h2>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Nama Lengkap <span style={{ color: '#E6D18B' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Nomor Telepon <span style={{ color: '#E6D18B' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Alamat <span style={{ color: '#E6D18B' }}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Metode Pembayaran
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                >
                  <option value="qris">QRIS (Semua E-Wallet)</option>
                  <option value="transfer">Transfer Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent focus:shadow-lg transition-all duration-300"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="Catatan untuk pesanan (opsional)"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#E6D18B' }}
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {loading ? 'Memproses...' : 'Selesaikan Pesanan'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-[20px] shadow-md p-6 sticky top-28 border-2" style={{ borderColor: '#E8E3DA' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#383838' }}>Ringkasan Pesanan</h3>
              <div className="space-y-3 mb-4" style={{ borderBottom: '2px solid #E8E3DA', paddingBottom: '1rem' }}>
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm" style={{ color: '#707070' }}>
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center" style={{ color: '#383838' }}>
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold" style={{ color: '#E6D18B' }}>{formatCurrency(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
