'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Minus, Package, Plus, ShoppingCart, X } from 'lucide-react'
import { toast } from 'react-toastify'

import AppIcon from '@/components/AppIcon'
import { useCartStore } from '@/store/cartStore'
import type { ProductVariant } from '@/types'

interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  price: number
  stock: number
  image_url: string | null
  sku: string
  variants: ProductVariant[]
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [imageUrl, setImageUrl] = useState(product.image_url || '/placeholder-product.svg')
  const imageRef = useRef<HTMLImageElement>(null)
  const { addItem, openCart } = useCartStore()
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId)
  const stock = selectedVariant?.stock ?? product.stock
  const price = selectedVariant?.price ?? product.price

  useEffect(() => {
    const image = imageRef.current
    if (image?.complete && image.naturalWidth === 0) setImageUrl('/placeholder-product.svg')
  }, [])

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

  const selectVariant = (variantId: string) => {
    setSelectedVariantId(variantId)
    setQuantity(1)
  }

  const addToCart = () => {
    if (stock < 1) {
      toast.error('Produk ini sedang habis')
      return
    }
    addItem({
      id: product.id,
      type: 'product',
      name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
      price,
      image_url: product.image_url,
      description: product.description,
      stock,
      maxQuantity: stock,
      sku: selectedVariant?.sku ?? product.sku,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantAttributes: selectedVariant?.attributes,
      quantity,
    })
    toast.success(`${product.name} ditambahkan ke keranjang`)
    openCart()
  }

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <Link href="/produk" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-button px-3 text-sm font-semibold text-dark-gold hover:bg-surface2 hover:text-secondary">
          <AppIcon icon={ArrowLeft} size="sm" />
          Kembali ke Produk
        </Link>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div className="relative aspect-square overflow-hidden bg-white rounded-lg border border-stone-200">
            <img
              ref={imageRef}
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null
                setImageUrl('/placeholder-product.svg')
              }}
            />
          </div>

          <section className="pt-1 lg:pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark-gold">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold mb-5" style={{ color: '#9A7B16' }}>{formatCurrency(price)}</p>

            <div className="flex items-center gap-2 text-sm mb-7">
              {stock > 0 ? (
                <>
                  <AppIcon icon={Check} size="sm" className="text-[#166534]" />
                  <span className="font-semibold text-[#166534]">Tersedia</span>
                  <span className="text-stone-500">{stock} stok</span>
                </>
              ) : (
                <>
                  <AppIcon icon={X} size="sm" className="text-stone-500" />
                  <span className="font-semibold text-stone-600">Stok habis</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-stone-600 leading-7 mb-8 whitespace-pre-line">{product.description}</p>
            )}

            {product.variants.length > 0 && (
              <fieldset className="mb-8">
                <legend className="text-sm font-bold text-stone-800 mb-3">Pilih Varian</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => selectVariant(variant.id)}
                      disabled={variant.stock < 1}
                      className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                        selectedVariantId === variant.id
                          ? 'border-primary-hover bg-primary/25 text-secondary'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-primary-hover'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
                {selectedVariant && Object.keys(selectedVariant.attributes).length > 0 && (
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {Object.entries(selectedVariant.attributes).map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-3 border-b border-stone-200 py-2">
                        <dt className="capitalize text-stone-500">{label}</dt>
                        <dd className="font-semibold text-stone-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </fieldset>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="grid grid-cols-[44px_52px_44px] h-12 border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Kurangi jumlah"
                  className="flex items-center justify-center hover:bg-stone-100 disabled:opacity-40"
                >
                  <AppIcon icon={Minus} size="sm" />
                </button>
                <span className="flex items-center justify-center font-bold border-x border-stone-200">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
                  disabled={quantity >= stock}
                  aria-label="Tambah jumlah"
                  className="flex items-center justify-center hover:bg-stone-100 disabled:opacity-40"
                >
                  <AppIcon icon={Plus} size="sm" />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={stock < 1}
                className="h-12 flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: stock > 0 ? '#E6D18B' : '#E8E3DA', color: '#2a2a1a' }}
              >
                <AppIcon icon={stock > 0 ? ShoppingCart : Package} size="sm" />
                {stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
            </div>
            <p className="mt-4 text-xs text-stone-500">SKU: {selectedVariant?.sku ?? product.sku}</p>
          </section>
        </div>
      </div>
    </main>
  )
}