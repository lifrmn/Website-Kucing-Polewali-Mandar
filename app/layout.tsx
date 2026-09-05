import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import PublicLayoutWrapper from '@/components/PublicLayoutWrapper'
import AuthProvider from '@/components/AuthProvider'
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
  metadataBase: new URL(process.env.AUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Cikal Pet Care Polewali Mandar | Grooming, Penitipan & Produk Kucing',
    template: '%s | Cikal Pet Care Polewali Mandar',
  },
  description: 'Perawatan kucing profesional di Polewali Mandar, mulai dari grooming dan penitipan hingga produk pilihan untuk kebutuhan kucing Anda.',
  keywords: 'pet care Polewali Mandar, grooming kucing, penitipan kucing, produk kucing, Cikal Pet Care',
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
