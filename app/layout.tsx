import type { Metadata } from 'next'
import { ReactNode } from 'react'
import PublicLayoutWrapper from '@/components/PublicLayoutWrapper'
import AuthProvider from '@/components/AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cikal Pet Care Polman | Sistem Informasi Manajemen Layanan Perawatan Kucing',
  description: 'Sistem Informasi Manajemen Layanan Perawatan Kucing Berbasis Web — Cikal Pet Care Polewali Mandar. Menyediakan layanan grooming, konsultasi kesehatan, penitipan kucing, pemesanan produk, dan laporan manajemen lengkap.',
  keywords: 'sistem informasi pet care, manajemen layanan kucing, pet care polman, klinik kucing polman, grooming kucing, penitipan kucing, dokter hewan polman, polewali mandar, skripsi pet care',
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
    <html lang="id">
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
