import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'whatsapp';
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
      primary: 'bg-primary text-[#2A2A1A] hover:bg-primary-hover active:bg-primary-pressed shadow-button hover:shadow-card',
      secondary: 'bg-secondary text-white hover:bg-secondary-hover',
      outline: 'bg-transparent border border-primary-hover text-text hover:bg-primary/20',
      ghost: 'bg-transparent text-text hover:bg-surface2',
      destructive: 'bg-danger text-white hover:bg-red-800 shadow-button',
      whatsapp: 'bg-[#128C4A] text-white hover:bg-[#0E743D] shadow-button',
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
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Memproses...</span>
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
