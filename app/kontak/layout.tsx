import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Kontak dan Lokasi',
  description: 'Hubungi Cikal Pet Care Polewali Mandar untuk informasi layanan, booking, produk, lokasi, dan jam operasional.',
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
