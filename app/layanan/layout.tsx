import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import { ServiceInitialDataProvider } from './ServiceInitialData'
import { parsePetTypes } from '@/lib/pet-types'

export const metadata: Metadata = {
  title: 'Layanan Perawatan Hewan',
  description: 'Layanan profesional untuk menjaga kebersihan, kesehatan, dan kenyamanan hewan kesayangan Anda.',
  alternates: { canonical: '/layanan' },
}

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  const services = await prisma.service.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      supported_pet_types: true,
      duration: true,
      price: true,
      image_url: true,
      is_active: true,
    },
  })

  return <ServiceInitialDataProvider services={services.map((service) => ({
    ...service,
    supported_pet_types: parsePetTypes(service.supported_pet_types),
  }))}>{children}</ServiceInitialDataProvider>
}
