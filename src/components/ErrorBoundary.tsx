'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fadeInUp">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-custom">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Oops! Terjadi Kesalahan
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau hubungi kami jika masalah berlanjut.
            </p>
            
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-600 hover:from-primary-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Muat Ulang</span>
              </button>
              
              <a
                href="/"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
