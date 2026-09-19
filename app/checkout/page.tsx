'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { orderService } from '@/services/orderService'
import { toast } from 'react-toastify'
import { Loader2, MapPin, ShoppingBag, ShoppingCart, Store, Truck } from 'lucide-react'
import { useSiteSettings } from '@/components/SiteSettingsContext'
import { calculateShipping, DELIVERY_AREAS, DELIVERY_AREA_LABELS, type DeliveryArea, type FulfillmentType } from '@/lib/delivery'

export default function CheckoutPage() {
  const router = useRouter()
  const settings = useSiteSettings()
  const { items, clearCart, syncWithServer } = useCartStore()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    fulfillment_type: 'DELIVERY' as FulfillmentType,
    delivery_area: 'POLEWALI' as DeliveryArea,
    notes: '',
    payment_method: '',
  })

  const availablePaymentMethods = [
    settings.qrisActive && settings.qrisImageUrl ? { value: 'qris', label: 'QRIS (Semua E-Wallet)' } : null,
    settings.bankTransferActive && settings.bankName && settings.bankAccount && settings.bankAccountName ? { value: 'transfer', label: 'Transfer Bank' } : null,
    settings.codActive ? { value: 'cod', label: 'Bayar di Tempat' } : null,
  ].filter((method): method is { value: string; label: string } => Boolean(method))

  useEffect(() => {
    if (!availablePaymentMethods.some((method) => method.value === formData.payment_method)) {
      setFormData((current) => ({ ...current, payment_method: availablePaymentMethods[0]?.value || '' }))
    }
  }, [settings.bankTransferActive, settings.bankName, settings.bankAccount, settings.bankAccountName, settings.qrisActive, settings.qrisImageUrl, settings.codActive]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (formData.fulfillment_type === 'DELIVERY' && !settings.deliveryActive && settings.pickupActive) {
      setFormData((current) => ({ ...current, fulfillment_type: 'PICKUP' }))
    } else if (formData.fulfillment_type === 'PICKUP' && !settings.pickupActive && settings.deliveryActive) {
      setFormData((current) => ({ ...current, fulfillment_type: 'DELIVERY' }))
    }
  }, [formData.fulfillment_type, settings.deliveryActive, settings.pickupActive])

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

    if (formData.fulfillment_type === 'DELIVERY' && !formData.address.trim()) {
      toast.error('Alamat harus diisi!')
      return
    }

    if (!formData.payment_method) {
      toast.error('Belum ada metode pembayaran yang tersedia')
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
      const synchronization = await syncWithServer()
      if (!synchronization.valid) {
        const messages = [...synchronization.errors, ...synchronization.changes]
        toast.error(messages[0] || 'Keranjang berubah. Periksa kembali sebelum checkout.')
        return
      }
      const synchronizedItems = useCartStore.getState().items
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        fulfillment_type: formData.fulfillment_type,
        delivery_area: formData.delivery_area,
        order_type: 'product' as const,
        items: synchronizedItems.map((item) => ({
          item_type: item.type,
          item_id: item.id,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
        payment_method: formData.payment_method as 'qris' | 'transfer' | 'cod',
        notes: formData.notes,
      }

      const result = await orderService.createOrder(orderData)

      if (result.success && result.data) {
        toast.success('Pesanan berhasil dibuat!')
        sessionStorage.setItem(
          `order-phone:${result.data.order_number}`,
          formData.phone.replace(/\s+/g, '')
        )
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

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingCost = calculateShipping(subtotal, formData.fulfillment_type, formData.delivery_area, settings)
  const total = subtotal + shippingCost

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
              <ShoppingCart className="w-12 h-12 text-dark-gold" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#383838' }}>Keranjang Kosong</h2>
            <p className="mb-8" style={{ color: '#707070' }}>
              Keranjang belanja Anda masih kosong. Yuk mulai belanja kebutuhan hewan kesayangan!
            </p>
            <button
              onClick={() => router.push('/produk')}
              className="inline-flex min-h-12 items-center gap-2 rounded-button bg-primary px-8 py-3 font-semibold text-[#2A2A1A] shadow-sm transition-colors hover:bg-primary-hover"
            >
              <ShoppingBag className="h-5 w-5" /> Lihat Produk
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
            <form onSubmit={handleSubmit} className="space-y-6 rounded-card border border-border bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#383838' }}>Informasi Pembeli</h2>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Nama Lengkap <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-premium"
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
                  className="input-premium"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Nomor Telepon <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <span className="mb-3 block text-sm font-bold text-text">Cara menerima pesanan</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {settings.deliveryActive && <button type="button" aria-pressed={formData.fulfillment_type === 'DELIVERY'} onClick={() => setFormData({ ...formData, fulfillment_type: 'DELIVERY' })} className={`flex min-h-14 items-center gap-3 rounded-button border p-3 text-left ${formData.fulfillment_type === 'DELIVERY' ? 'border-primary-hover bg-primary/20' : 'border-border'}`}><Truck className="h-5 w-5" /><span><strong className="block text-sm">Diantar</strong><span className="text-xs text-muted">Pilih kecamatan tujuan</span></span></button>}
                  {settings.pickupActive && <button type="button" aria-pressed={formData.fulfillment_type === 'PICKUP'} onClick={() => setFormData({ ...formData, fulfillment_type: 'PICKUP' })} className={`flex min-h-14 items-center gap-3 rounded-button border p-3 text-left ${formData.fulfillment_type === 'PICKUP' ? 'border-primary-hover bg-primary/20' : 'border-border'}`}><Store className="h-5 w-5" /><span><strong className="block text-sm">Ambil di Toko</strong><span className="text-xs text-muted">Tanpa biaya pengiriman</span></span></button>}
                </div>
              </div>

              {formData.fulfillment_type === 'DELIVERY' ? <>
              <div>
                <label className="block text-sm font-bold mb-2 text-text">Wilayah Pengantaran <span className="text-danger" aria-hidden="true">*</span></label>
                <select name="delivery_area" value={formData.delivery_area} onChange={handleChange} className="input-premium" required>
                  {DELIVERY_AREAS.map((area) => <option key={area} value={area}>{DELIVERY_AREA_LABELS[area]} · {formatCurrency(calculateShipping(0, 'DELIVERY', area, settings))}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Alamat Pengantaran <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input-premium"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
              </> : <div className="flex items-start gap-3 rounded-button border border-border bg-surface2 p-4"><MapPin className="mt-0.5 h-5 w-5 text-dark-gold" /><div><p className="font-semibold text-text">Lokasi pengambilan</p><p className="text-sm text-muted">{settings.address}</p></div></div>}

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Metode Pembayaran
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  disabled={availablePaymentMethods.length === 0}
                  className="input-premium"
                >
                  {availablePaymentMethods.length === 0 && <option value="">Belum ada metode tersedia</option>}
                  {availablePaymentMethods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
                </select>
                {availablePaymentMethods.length === 0 && <p className="mt-2 text-sm text-danger">Checkout belum tersedia sampai metode pembayaran diaktifkan.</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="Catatan untuk pesanan (opsional)"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={loading || availablePaymentMethods.length === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-button bg-primary px-6 py-3 font-semibold text-[#2A2A1A] shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {loading ? 'Memproses...' : 'Selesaikan Pesanan'}
              </button>
            </form>
          </div>

          <div>
            <div className="sticky top-28 rounded-card border border-border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#383838' }}>Ringkasan Pesanan</h3>
              <div className="space-y-3 mb-4" style={{ borderBottom: '2px solid #E8E3DA', paddingBottom: '1rem' }}>
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-muted">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface2">
                      {item.image_url ? <img src={item.image_url} alt="" className="h-full w-full object-cover" /> : <ShoppingBag className="m-3 h-6 w-6 text-muted" />}
                    </div>
                    <div className="min-w-0 flex-1"><p className="line-clamp-2 text-text">{item.name}</p><p className="text-xs">Jumlah: {item.quantity || 1}</p></div>
                    <span className="whitespace-nowrap font-medium text-text">{formatCurrency(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center" style={{ color: '#383838' }}>
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center" style={{ color: '#383838' }}>
                <span>{formData.fulfillment_type === 'PICKUP' ? 'Ambil di toko' : `Ongkir ${DELIVERY_AREA_LABELS[formData.delivery_area]}`}</span>
                <span className="font-semibold">{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-3" style={{ color: '#383838' }}>
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-dark-gold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
