import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Booking Penitipan Kucing',
  description: 'Pilih paket penitipan dan jadwalkan perawatan kucing Anda di Cikal Pet Care Polewali Mandar.',
}

export default function BookingLayout({ children }: { children: ReactNode }) {
  return children
}
