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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
              <PawPrint className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600">Cikal Pet Care Polman</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="admin@cikalpetcare.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
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
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@cikalpetcare.com<br />
              Password: admin123
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
