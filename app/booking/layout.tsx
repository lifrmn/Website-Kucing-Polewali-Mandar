import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import type { PenitipanPackage } from '@/types'
import { BookingInitialDataProvider } from './BookingInitialData'
import { parsePetTypes } from '@/lib/pet-types'

export const metadata: Metadata = {
  title: 'Booking Penitipan Hewan',
  description: 'Pilih paket penitipan yang sesuai untuk keamanan dan kenyamanan hewan kesayangan Anda.',
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
    accepted_pet_types: parsePetTypes(record.accepted_pet_types),
    created_at: record.created_at.toISOString(),
    updated_at: record.updated_at.toISOString(),
  }))

  return <BookingInitialDataProvider packages={packages}>{children}</BookingInitialDataProvider>
}
