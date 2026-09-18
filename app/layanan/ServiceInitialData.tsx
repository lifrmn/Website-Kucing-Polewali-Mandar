'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface PublicService {
  id: string
  name: string
  description: string | null
  type: string
  duration: number | null
  price: number
  is_active: boolean
}

const ServiceInitialDataContext = createContext<PublicService[]>([])

export function ServiceInitialDataProvider({ children, services }: { children: ReactNode; services: PublicService[] }) {
  return <ServiceInitialDataContext.Provider value={services}>{children}</ServiceInitialDataContext.Provider>
}

export function useServiceInitialData() {
  return useContext(ServiceInitialDataContext)
}