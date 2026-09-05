'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2, PawPrint } from 'lucide-react'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email atau password salah!')
        setLoading(false)
      } else {
        toast.success('Login berhasil! Redirecting...')
        router.push('/admin')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-4 pt-24">
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-card border border-border bg-white p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-xl" style={{ backgroundColor: '#E6D18B' }}>
              <PawPrint className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-text">Masuk Admin</h1>
            <p style={{ color: '#707070' }}>Cikal Pet Care Polman</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#707070' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-premium pl-12"
                  placeholder="admin@cikalpetcare.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#707070' }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-premium pl-12"
                  placeholder="Masukkan kata sandi"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-button bg-primary px-6 font-semibold text-[#2A2A1A] shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="font-semibold text-dark-gold transition-colors hover:text-secondary"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
