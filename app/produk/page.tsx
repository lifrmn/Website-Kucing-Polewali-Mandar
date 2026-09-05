'use client'

import { useEffect, useState } from 'react'
import { productService } from '@/services/productService'
import type { Product } from '@/types'
import { Search, ShoppingCart, Check, X, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-toastify'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppIcon from '@/components/AppIcon'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const response = await productService.getProducts()
    if (response.success && response.data) {
      setProducts(response.data.data)
      setFilteredProducts(response.data.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let filtered = [...products]
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
    setFilteredProducts(filtered)
  }, [searchQuery, categoryFilter, sortBy, products])

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (product: Product) => {
    const variant = product.variants?.find(item => item.id === selectedVariants[product.id])
      || product.variants?.[0]
    const stock = variant?.stock ?? product.stock
    if (stock <= 0) {
      toast.error('Produk ini sedang habis')
      return
    }
    addItem({
      id: product.id,
      type: 'product',
      name: variant ? `${product.name} - ${variant.name}` : product.name,
      price: variant?.price ?? product.price,
      image_url: product.image_url,
      description: product.description,
      stock,
      maxQuantity: stock,
      sku: variant?.sku ?? product.sku,
      variantId: variant?.id,
      variantName: variant?.name,
      variantAttributes: variant?.attributes,
    })
    toast.success(`${product.name} ditambahkan ke keranjang!`)
    openCart()
  }

  if (loading) {
    return (
      <LoadingSpinner
        message="Memuat produk..."
        submessage="Menyiapkan data produk"
        variant="primary"
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
            Produk Kucing Terbaik
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Pilihan lengkap produk berkualitas untuk kesehatan dan kebahagiaan kucing Anda
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
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-12 pl-10 pr-10 py-2.5 border border-border rounded-button bg-white focus:ring-2 focus:ring-primary focus:border-primary-hover transition-colors text-sm md:text-base"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-surface2 hover:text-text" aria-label="Hapus pencarian">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                title={categoryFilter === 'all' ? 'Semua Kategori' : categories.find(c => c === categoryFilter) || ''}
                className="flex-1 sm:flex-initial sm:min-w-[200px] min-h-12 px-4 py-2.5 border border-border rounded-button focus:ring-2 focus:ring-primary bg-white text-sm md:text-base truncate"
              >
                <option value="all">Semua Kategori</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title={sortBy === 'name' ? 'Nama (A-Z)' : sortBy === 'price-asc' ? 'Harga: Terendah' : 'Harga: Tertinggi'}
                className="flex-1 sm:flex-initial sm:min-w-[200px] min-h-12 px-4 py-2.5 border border-border rounded-button focus:ring-2 focus:ring-primary bg-white text-sm md:text-base truncate"
              >
                <option value="name">Nama (A-Z)</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-500">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AppIcon icon={Package} size="2xl" className="text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">Belum ada produk tersedia</p>
              <p className="mx-auto max-w-md text-muted">Produk belum tersedia saat ini. Silakan cek kembali atau hubungi kami melalui WhatsApp.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AppIcon icon={Search} size="2xl" className="text-amber-500" />
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">Produk tidak ditemukan</p>
              <p className="text-slate-500 mb-6">Coba ubah kata kunci atau filter</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setSortBy('name'); }}
                className="min-h-11 rounded-button bg-primary px-6 py-2.5 font-semibold text-[#2A2A1A] transition-colors hover:bg-primary-hover"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {filteredProducts.map((product) => {
                const selectedVariant = product.variants?.find(
                  variant => variant.id === selectedVariants[product.id]
                ) || product.variants?.[0]
                const displayStock = selectedVariant?.stock ?? product.stock
                const displayPrice = selectedVariant?.price ?? product.price

                return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-card border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  {/* Image */}
                  <Link href={`/produk/${product.slug}`} className="relative block h-44 md:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image_url || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/placeholder-product.svg'
                      }}
                    />
                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {displayStock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                          <AppIcon icon={Check} size="xs" />
                          <span className="leading-none">Tersedia</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white text-xs font-semibold rounded-full">
                          <AppIcon icon={X} size="xs" />
                          <span className="leading-none">Habis</span>
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <Link href={`/produk/${product.slug}`} className="block mb-2 md:mb-3">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2.5rem] text-text hover:text-dark-gold transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {product.variants && product.variants.length > 0 && (
                      <select
                        value={selectedVariant?.id}
                        onChange={(event) => setSelectedVariants((current) => ({
                          ...current,
                          [product.id]: event.target.value,
                        }))}
                        aria-label={`Pilih varian ${product.name}`}
                        className="w-full mb-3 min-h-11 px-3 py-2 border border-border rounded-button bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary-hover"
                      >
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id} disabled={variant.stock <= 0}>
                            {variant.name} ({variant.stock > 0 ? `${variant.stock} tersedia` : 'habis'})
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="text-lg md:text-xl font-bold text-dark-gold">
                        {formatCurrency(displayPrice)}
                      </span>
                      <span className="text-xs md:text-sm" style={{ color: '#707070' }}>
                        Stok: {displayStock}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={displayStock <= 0}
                      className={`w-full py-2.5 md:py-3 px-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        displayStock > 0
                          ? 'hover:opacity-90'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      style={displayStock > 0
                        ? { backgroundColor: '#E6D18B', color: '#2a2a1a' }
                        : { backgroundColor: '#E8E3DA', color: '#707070' }
                      }
                    >
                      {displayStock > 0 ? (
                        <>
                          <AppIcon icon={ShoppingCart} size="sm" />
                          <span className="leading-none">Tambah ke Keranjang</span>
                        </>
                      ) : (
                        <>
                          <AppIcon icon={X} size="sm" />
                          <span className="leading-none">Stok Habis</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
