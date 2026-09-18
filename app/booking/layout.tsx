import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import type { PenitipanPackage } from '@/types'
import { BookingInitialDataProvider } from './BookingInitialData'

export const metadata: Metadata = {
  title: 'Booking Penitipan Kucing',
  description: 'Pilih paket penitipan dan jadwalkan perawatan kucing Anda di Cikal Pet Care Polewali Mandar.',
  alternates: { canonical: '/booking' },
}

export default async function BookingLayout({ children }: { children: ReactNode }) {
  const records = await prisma.penitipanPackage.findMany({
    where: { is_active: true },
    orderBy: { price_per_night: 'asc' },
  })
  const packages: PenitipanPackage[] = records.map((record) => ({
    ...record,
    description: record.description ?? undefined,
    features: record.features.split(',').map((feature) => feature.trim()).filter(Boolean),
    created_at: record.created_at.toISOString(),
    updated_at: record.updated_at.toISOString(),
  }))

  return <BookingInitialDataProvider packages={packages}>{children}</BookingInitialDataProvider>
}
