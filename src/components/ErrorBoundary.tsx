'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { CircleAlert, Home, RotateCcw } from 'lucide-react'

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
        <div className="flex min-h-screen items-center justify-center bg-bg p-4">
          <div className="w-full max-w-md rounded-card border border-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2]">
              <CircleAlert className="h-10 w-10 text-danger" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Halaman belum dapat dimuat
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau hubungi kami jika masalah berlanjut.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex min-h-12 items-center gap-2 rounded-button bg-primary px-6 py-3 font-semibold text-[#2A2A1A] transition-colors hover:bg-primary-hover"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Muat Ulang</span>
              </button>
              
              <a
                href="/"
                className="flex min-h-12 items-center gap-2 rounded-button border border-border px-6 py-3 font-semibold text-text transition-colors hover:bg-surface2"
              >
                <Home className="h-5 w-5" /> Ke Beranda
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
