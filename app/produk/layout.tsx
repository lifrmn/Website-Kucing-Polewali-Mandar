import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import { toProductResponse } from '@/lib/product-response'
import type { Product } from '@/types'
import { ProductInitialDataProvider } from './ProductInitialData'

export const metadata: Metadata = {
  title: 'Produk untuk Hewan Kesayangan',
  description: 'Temukan makanan, perlengkapan grooming, aksesori, mainan, dan kebutuhan harian untuk hewan kesayangan Anda.',
  alternates: { canonical: '/produk' },
}

export default async function ProductsLayout({ children }: { children: ReactNode }) {
  const records = await prisma.product.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
    include: {
      variants: {
        where: { is_active: true },
        orderBy: { created_at: 'asc' },
      },
    },
  })
  const products = records.map((record) => {
    const product = toProductResponse(record)
    return {
      ...product,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
      variants: product.variants.map((variant) => ({
        ...variant,
        created_at: variant.created_at.toISOString(),
        updated_at: variant.updated_at.toISOString(),
      })),
    } as Product
  })

  return <ProductInitialDataProvider products={products}>{children}</ProductInitialDataProvider>
}
