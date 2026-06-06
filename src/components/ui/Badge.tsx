import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center gap-1 rounded-badge font-semibold';
    
    const variants = {
      primary: 'bg-primary text-white',
      accent: 'bg-accent text-white',
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
      outline: 'bg-transparent border border-border text-text',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-caption',
      md: 'px-3 py-1 text-caption',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
