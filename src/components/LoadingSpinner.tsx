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
  const variants = {
    default: {
      gradient: 'from-gray-400 to-gray-500',
      gradientBg: 'from-gray-50 to-white',
      spinnerColor: 'text-gray-600',
    },
    primary: {
      gradient: 'from-primary-400 to-emerald-400',
      gradientBg: 'from-primary-50 via-white to-emerald-50',
      spinnerColor: 'text-primary-600',
    },
    purple: {
      gradient: 'from-purple-400 to-pink-400',
      gradientBg: 'from-purple-50 via-white to-pink-50',
      spinnerColor: 'text-purple-600',
    },
    green: {
      gradient: 'from-green-400 to-emerald-400',
      gradientBg: 'from-green-50 via-white to-emerald-50',
      spinnerColor: 'text-green-600',
    },
  };

  const sizes = {
    sm: {
      spinner: 'w-12 h-12',
      message: 'text-base',
      submessage: 'text-xs',
      blur: 'w-20 h-20',
    },
    md: {
      spinner: 'w-16 h-16',
      message: 'text-lg',
      submessage: 'text-sm',
      blur: 'w-28 h-28',
    },
    lg: {
      spinner: 'w-20 h-20',
      message: 'text-xl',
      submessage: 'text-sm',
      blur: 'w-32 h-32',
    },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${variantStyle.gradientBg}`}>
      <div className="text-center px-4">
        <div className="relative inline-block mb-6">
          <div className={`absolute inset-0 bg-gradient-to-r ${variantStyle.gradient} blur-xl opacity-50 animate-pulse-custom ${sizeStyle.blur}`}></div>
          <Loader2 className={`animate-spin ${sizeStyle.spinner} ${variantStyle.spinnerColor} mx-auto relative`} />
        </div>
        <div className="space-y-2">
          <p className={`${sizeStyle.message} text-gray-800 font-bold`}>{message}</p>
          {submessage && (
            <p className={`${sizeStyle.submessage} text-gray-500`}>{submessage}</p>
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
