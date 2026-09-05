import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  variant?: 'default' | 'primary' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  message = 'Memuat data...',
  submessage,
  variant = 'primary',
  size = 'lg',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: {
      spinner: 'w-12 h-12',
      message: 'text-base',
      submessage: 'text-xs',
    },
    md: {
      spinner: 'w-16 h-16',
      message: 'text-lg',
      submessage: 'text-sm',
    },
    lg: {
      spinner: 'w-20 h-20',
      message: 'text-xl',
      submessage: 'text-sm',
    },
  };

  const sizeStyle = sizes[size];

  return (
    <div className="flex min-h-[55vh] items-center justify-center bg-bg" data-legacy-variant={variant}>
      <div className="text-center px-4">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-1 rounded-full bg-primary/20 blur-lg" />
          <Loader2 className={`animate-spin ${sizeStyle.spinner} text-dark-gold mx-auto relative`} />
        </div>
        <div className="space-y-2">
          <p className={`${sizeStyle.message} font-semibold text-text`}>{message}</p>
          {submessage && (
            <p className={`${sizeStyle.submessage} text-muted`}>{submessage}</p>
          )}
        </div>
        {/* Loading skeleton */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3 bg-gray-200 rounded-full skeleton animate-shimmer"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
