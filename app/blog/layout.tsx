import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Tips Perawatan Kucing',
  description: 'Baca artikel dan panduan praktis untuk menjaga kesehatan serta kenyamanan kucing kesayangan Anda.',
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children
}
