import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'
import { toProductResponse } from '@/lib/product-response'
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
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await findProduct(slug)
  if (!product) notFound()

  const response = toProductResponse(product)
  return <ProductDetailClient product={{
    id: response.id,
    name: response.name,
    slug: response.slug,
    description: response.description,
    category: response.category,
    price: response.price,
    stock: response.stock,
    image_url: response.image_url,
    sku: response.sku,
    variants: response.variants,
  }} />
}