'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface BlogListPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  is_published: boolean
}

interface BlogInitialData {
  posts: BlogListPost[]
  totalPages: number
}

const BlogInitialDataContext = createContext<BlogInitialData>({ posts: [], totalPages: 1 })

export function BlogInitialDataProvider({ children, data }: { children: ReactNode; data: BlogInitialData }) {
  return <BlogInitialDataContext.Provider value={data}>{children}</BlogInitialDataContext.Provider>
}

export function useBlogInitialData() {
  return useContext(BlogInitialDataContext)
}