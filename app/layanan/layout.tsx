import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import prisma from '@/lib/prisma'
import { ServiceInitialDataProvider } from './ServiceInitialData'

export const metadata: Metadata = {
  title: 'Layanan Perawatan Kucing',
  description: 'Lihat layanan grooming dan perawatan kucing profesional dari Cikal Pet Care Polewali Mandar.',
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
      duration: true,
      price: true,
      is_active: true,
    },
  })

  return <ServiceInitialDataProvider services={services}>{children}</ServiceInitialDataProvider>
}
