import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Layanan Perawatan Kucing',
  description: 'Lihat layanan grooming dan perawatan kucing profesional dari Cikal Pet Care Polewali Mandar.',
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children
}
