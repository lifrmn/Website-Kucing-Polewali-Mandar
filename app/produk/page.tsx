'use client'

import { useEffect, useState } from 'react'
import { productService } from '@/services/productService'
import type { Product } from '@/types'
import { Search, ShoppingCart, Check, X, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-toastify'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppIcon from '@/components/AppIcon'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
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
    if (product.stock <= 0) {
      toast.error('Produk ini sedang habis')
      return
    }
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
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
                className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm md:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                title={categoryFilter === 'all' ? 'Semua Kategori' : categories.find(c => c === categoryFilter) || ''}
                className="flex-1 sm:flex-initial sm:min-w-[240px] px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-sm md:text-base truncate"
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
                className="flex-1 sm:flex-initial sm:min-w-[220px] px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-sm md:text-base truncate"
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
              <p className="text-slate-500">Pastikan database sudah disetup dengan benar</p>
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
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white transition-all duration-300 hover:-translate-y-2"
                  style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
                >
                  {/* Image */}
                  <div className="relative h-44 md:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=400&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: '#4ade80' }}>
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
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-sm md:text-base mb-2 md:mb-3 line-clamp-2 min-h-[2.5rem]" style={{ color: '#383838' }}>
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <span className="text-lg md:text-xl font-bold" style={{ color: '#E6D18B' }}>
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs md:text-sm" style={{ color: '#707070' }}>
                        Stok: {product.stock}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-2.5 md:py-3 px-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        product.stock > 0
                          ? 'hover:opacity-90'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      style={product.stock > 0
                        ? { backgroundColor: '#E6D18B', color: '#2a2a1a' }
                        : { backgroundColor: '#E8E3DA', color: '#707070' }
                      }
                    >
                      {product.stock > 0 ? (
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
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
