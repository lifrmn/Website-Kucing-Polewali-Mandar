import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'
import { toProductResponse } from '@/lib/product-response'
import { getSiteUrl } from '@/lib/site-url'
import ProductDetailClient from './ProductDetailClient'

async function findProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, is_active: true },
    include: {
      variants: {
        where: { is_active: true },
        orderBy: { created_at: 'asc' },
      },
    },
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await findProduct(slug)
  if (!product) return { title: 'Produk tidak ditemukan' }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description || `Lihat detail ${product.name}`,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await findProduct(slug)
  if (!product) notFound()

  const response = toProductResponse(product)
  const productUrl = `${getSiteUrl()}/produk/${response.slug}`
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: response.name,
    description: response.description || undefined,
    image: response.image_url || undefined,
    sku: response.sku,
    category: response.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IDR',
      price: response.price,
      availability: response.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${getSiteUrl()}/produk` },
      { '@type': 'ListItem', position: 3, name: response.name, item: productUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
      <ProductDetailClient product={{
        id: response.id,
        name: response.name,
        slug: response.slug,
        description: response.description,
        category: response.category,
        price: response.price,
        stock: response.stock,
        image_url: response.image_url,
        sku: response.sku,
        pet_types: response.pet_types,
        variants: response.variants,
      }} />
    </>
  )
}