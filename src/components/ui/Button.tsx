import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'btn-base inline-flex items-center justify-center gap-2 font-semibold transition-all duration-hover disabled:opacity-50 disabled:cursor-not-allowed touch-target';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed shadow-button hover:shadow-card',
      secondary: 'bg-surface2 text-text hover:bg-surface border border-border hover:border-primary',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'bg-transparent text-text hover:bg-surface2',
      destructive: 'bg-danger text-white hover:bg-red-600 shadow-button',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-small rounded-button min-h-[40px]',
      md: 'px-5 py-3 text-body rounded-button min-h-[48px]',
      lg: 'px-6 py-4 text-body rounded-button min-h-[56px]',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          isLoading && 'relative cursor-wait',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
