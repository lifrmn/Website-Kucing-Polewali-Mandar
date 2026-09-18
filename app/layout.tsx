import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import PublicLayoutWrapper from '@/components/PublicLayoutWrapper'
import AuthProvider from '@/components/AuthProvider'
import { getSiteUrl } from '@/lib/site-url'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Cikal Pet Care Polewali Mandar | Grooming & Penitipan Kucing',
    template: '%s | Cikal Pet Care Polewali Mandar',
  },
  description: 'Grooming kucing, penitipan kucing, pet hotel dan kebutuhan kucing di Polewali Mandar. Booking perawatan kucing dengan mudah bersama Cikal Pet Care.',
  keywords: [
    'grooming kucing Polewali',
    'penitipan kucing Polewali',
    'pet hotel Polewali Mandar',
    'pet care Polewali',
    'grooming Polman',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </body>
    </html>
  )
}
