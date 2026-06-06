import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-surface2 text-text',
        primary: 'bg-green-50 text-green-700 border border-green-200',
        success: 'bg-green-50 text-green-700',
        danger: 'bg-red-50 text-red-700',
        warning: 'bg-amber-50 text-amber-700',
        info: 'bg-blue-50 text-blue-700',
        muted: 'bg-gray-50 text-gray-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export default function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
