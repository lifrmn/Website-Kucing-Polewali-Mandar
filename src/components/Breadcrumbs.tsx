'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm animate-fadeInUp">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium"
      >
        <Home className="w-4 h-4" />
        <span>Beranda</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-gray-400" />
            {isLast || !item.href ? (
              <span className="text-primary-600 font-bold">{item.label}</span>
            ) : (
              <Link 
                href={item.href} 
                className="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
