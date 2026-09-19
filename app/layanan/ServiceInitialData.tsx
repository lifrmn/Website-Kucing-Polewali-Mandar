'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PetType } from '@/types/enums'

export interface PublicService {
  id: string
  name: string
  description: string | null
  type: string
  supported_pet_types: PetType[]
  duration: number | null
  price: number
  image_url: string | null
  is_active: boolean
}

const ServiceInitialDataContext = createContext<PublicService[]>([])

export function ServiceInitialDataProvider({ children, services }: { children: ReactNode; services: PublicService[] }) {
  return <ServiceInitialDataContext.Provider value={services}>{children}</ServiceInitialDataContext.Provider>
}

export function useServiceInitialData() {
  return useContext(ServiceInitialDataContext)
}