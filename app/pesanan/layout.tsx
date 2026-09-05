import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Lacak Pesanan',
  description: 'Periksa status pembayaran, pemrosesan, dan pengiriman pesanan Cikal Pet Care Anda.',
}

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return children
}
