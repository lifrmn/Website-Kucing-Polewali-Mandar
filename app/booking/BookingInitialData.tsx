'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PenitipanPackage } from '@/types'

const BookingInitialDataContext = createContext<PenitipanPackage[]>([])

export function BookingInitialDataProvider({ children, packages }: { children: ReactNode; packages: PenitipanPackage[] }) {
  return <BookingInitialDataContext.Provider value={packages}>{children}</BookingInitialDataContext.Provider>
}

export function useBookingInitialData() {
  return useContext(BookingInitialDataContext)
}