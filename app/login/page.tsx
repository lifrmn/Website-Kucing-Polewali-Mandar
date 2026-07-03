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
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float" style={{ backgroundColor: '#E6D18B' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float" style={{ backgroundColor: '#3b3a2e', animationDelay: '2s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-[20px] shadow-xl p-8 border-2" style={{ borderColor: '#E8E3DA' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-xl" style={{ backgroundColor: '#E6D18B' }}>
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#383838', fontFamily: "'Poppins',sans-serif" }}>Admin Login</h1>
            <p style={{ color: '#707070' }}>Cikal Pet Care Polman</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#707070' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="admin@cikalpetcare.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#383838' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#707070' }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  style={{ borderColor: '#E8E3DA' }}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 hover:opacity-90"
              style={{ backgroundColor: '#E6D18B' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 rounded-[12px] border-2" style={{ backgroundColor: '#FAF8F5', borderColor: '#E8E3DA' }}>
            <p className="text-sm text-center" style={{ color: '#707070' }}>
              <strong style={{ color: '#383838' }}>Demo Credentials:</strong><br />
              Email: admin@cikalpetcare.com<br />
              Password: admin123
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="font-semibold transition-colors hover:opacity-70"
              style={{ color: '#E6D18B' }}
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
