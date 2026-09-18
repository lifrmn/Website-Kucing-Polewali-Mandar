'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Product } from '@/types'

const ProductInitialDataContext = createContext<Product[]>([])

export function ProductInitialDataProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  return <ProductInitialDataContext.Provider value={products}>{children}</ProductInitialDataContext.Provider>
}

export function useProductInitialData() {
  return useContext(ProductInitialDataContext)
}