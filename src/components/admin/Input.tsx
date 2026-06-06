import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm',
            'placeholder:text-muted/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface2',
            'transition-colors duration-200',
            error && 'border-danger focus-visible:ring-danger',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
