'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-card mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          
          <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-text mb-2">
            Admin Login
          </h1>
          <p className="text-body text-muted">
            Cikal Pet Care Polman
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In to Dashboard</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/20 rounded-button">
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-small font-semibold text-danger mb-1">
                      Login Failed
                    </p>
                    <p className="text-small text-danger/80">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                placeholder="admin@cikalpetcare.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                className="mt-6"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Dev Credentials Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-surface2 rounded-button border border-border">
                  <p className="text-caption font-semibold text-muted mb-2">
                    🔧 Development Credentials:
                  </p>
                  <p className="text-caption text-muted">
                    Email: <span className="font-mono">admin@cikalpetcare.com</span>
                  </p>
                  <p className="text-caption text-muted">
                    Password: <span className="font-mono">admin123</span>
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-caption text-muted mt-6">
          © 2026 Cikal Pet Care Polman. All rights reserved.
        </p>
      </div>
    </div>
  );
}
