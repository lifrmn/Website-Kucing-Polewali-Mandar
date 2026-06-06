import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-small font-semibold text-text"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'input-premium w-full px-4 py-3 bg-surface border border-border rounded-button text-text placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-hover shadow-input resize-y',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[120px]',
            error && 'input-error border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        
        {error && (
          <span className="text-caption text-danger flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </span>
        )}
        
        {helperText && !error && (
          <span className="text-caption text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
