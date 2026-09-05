import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pesanan produk dan layanan Cikal Pet Care dengan aman.',
}

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children
}
