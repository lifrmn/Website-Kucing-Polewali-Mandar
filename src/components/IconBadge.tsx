import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';
import AppIcon, { IconSize } from './AppIcon';

export interface IconBadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  iconSize?: IconSize | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'soft' | 'outline';
  shape?: 'square' | 'rounded' | 'circle';
  className?: string;
  iconClassName?: string;
  label?: string;
}

/**
 * Standardized icon badge wrapper for icons in circles/squares.
 * Ensures consistent icon container styling across the app.
 * 
 * Size Guide:
 * - sm: 32px container, 16px icon
 * - md: 40px container, 20px icon (DEFAULT)
 * - lg: 48px container, 24px icon
 * - xl: 56px container, 28px icon
 * 
 * Variants:
 * - default: bg-surface2 text-text
 * - primary: bg-primary text-white
 * - success: bg-green-50 text-green-600
 * - danger: bg-red-50 text-red-600
 * - warning: bg-amber-50 text-amber-600
 * - soft: bg-white/10 text-current (for dark backgrounds)
 * - outline: border-2 border-current bg-transparent
 * 
 * Shapes:
 * - square: rounded-lg
 * - rounded: rounded-xl (DEFAULT)
 * - circle: rounded-full
 * 
 * @example
 * <IconBadge icon={ShoppingCart} variant="primary" size="lg" />
 * <IconBadge icon={Check} variant="success" shape="circle" />
 * <IconBadge icon={MapPin} variant="soft" size="md" />
 */
const IconBadge = forwardRef<HTMLDivElement, IconBadgeProps>(
  (
    {
      icon,
      iconSize,
      size = 'md',
      variant = 'default',
      shape = 'rounded',
      className,
      iconClassName,
      label,
      ...props
    },
    ref
  ) => {
    // Container sizes
    const containerSizes = {
      sm: 'w-8 h-8',    // 32px
      md: 'w-10 h-10',  // 40px
      lg: 'w-12 h-12',  // 48px
      xl: 'w-14 h-14',  // 56px
    };

    // Default icon sizes for each container
    const defaultIconSizes: Record<typeof size, IconSize> = {
      sm: 'xs',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    };

    // Variant styles
    const variants = {
      default: 'bg-surface2 text-text',
      primary: 'bg-primary text-white shadow-md',
      success: 'bg-green-50 text-green-600',
      danger: 'bg-red-50 text-red-600',
      warning: 'bg-amber-50 text-amber-600',
      soft: 'bg-white/10 text-current backdrop-blur-sm',
      outline: 'border-2 border-current bg-transparent',
    };

    // Shape styles
    const shapes = {
      square: 'rounded-lg',
      rounded: 'rounded-xl',
      circle: 'rounded-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center flex-shrink-0',
          containerSizes[size],
          variants[variant],
          shapes[shape],
          'transition-all duration-200',
          className
        )}
        aria-label={label}
        {...props}
      >
        <AppIcon
          icon={icon}
          size={iconSize || defaultIconSizes[size]}
          className={iconClassName}
          label={label}
        />
      </div>
    );
  }
);

IconBadge.displayName = 'IconBadge';

export default IconBadge;
