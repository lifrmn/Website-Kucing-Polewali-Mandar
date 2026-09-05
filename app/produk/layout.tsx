import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Produk Kucing',
  description: 'Temukan makanan, perlengkapan, dan produk pilihan untuk kebutuhan kucing Anda di Cikal Pet Care Polewali Mandar.',
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children
}
