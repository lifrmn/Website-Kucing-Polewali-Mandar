import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  variant?: 'form' | 'toolbar';
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, variant = 'form', fullWidth = false, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get selected option label for tooltip
    const selectedOption = options.find(opt => opt.value === props.value);
    const selectedLabel = selectedOption?.label || '';
    
    return (
      <div className={cn(
        variant === 'form' && 'w-full',
        variant === 'toolbar' && !fullWidth && 'w-[220px] min-w-[220px]',
        fullWidth && 'w-full'
      )}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            title={selectedLabel}
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border border-border bg-surface px-4 py-2 text-sm pr-10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface2',
              'transition-colors duration-200',
              'truncate',
              error && 'border-danger focus-visible:ring-danger',
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted pointer-events-none" />
        </div>
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

Select.displayName = 'Select';

export default Select;
