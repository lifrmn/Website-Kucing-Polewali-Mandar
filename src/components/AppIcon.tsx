import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

// Global icon size standards
export const ICON_SIZES = {
  xs: 16,  // --icon-xs: Tiny icons, badges
  sm: 18,  // --icon-sm: Inline text, compact UI
  md: 20,  // --icon-md: Menu, navbar, default
  lg: 24,  // --icon-lg: Features, cards, sections
  xl: 32,  // --icon-xl: Hero badges, large features
  '2xl': 40, // Headlines, hero icons
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export interface AppIconProps extends Omit<HTMLAttributes<SVGElement>, 'ref'> {
  icon: LucideIcon;
  size?: IconSize | number;
  strokeWidth?: number;
  className?: string;
  label?: string; // Aria-label for accessibility
}

/**
 * Global icon component ensuring 100% consistency across the entire app.
 * 
 * Standards:
 * - Uses Lucide React only (except social media icons)
 * - Default size: 'md' (20px) - suitable for navbar/menu
 * - Default strokeWidth: 2 for crisp, modern look
 * - All icons are flex-shrink-0 to prevent squishing
 * - Inline-flex for proper alignment with text
 * 
 * Size Guide:
 * - xs (16px): Small badges, tiny UI elements
 * - sm (18px): Inline with text, compact buttons
 * - md (20px): Menu items, navbar, cards (DEFAULT)
 * - lg (24px): Feature sections, large buttons
 * - xl (32px): Hero badges, large features
 * - 2xl (40px): Hero sections, headline icons
 * 
 * @example
 * <AppIcon icon={ShoppingCart} size="md" />
 * <AppIcon icon={Check} size="lg" className="text-green-600" />
 * <AppIcon icon={Star} size={28} strokeWidth={1.5} />
 */
const AppIcon = forwardRef<SVGSVGElement, AppIconProps>(
  ({ icon: Icon, size = 'md', strokeWidth = 2, className, label, ...props }, ref) => {
    const sizeValue = typeof size === 'number' ? size : ICON_SIZES[size];
    
    return (
      <Icon
        ref={ref}
        className={cn(
          'flex-shrink-0 inline-flex',
          className
        )}
        size={sizeValue}
        strokeWidth={strokeWidth}
        aria-label={label}
        aria-hidden={!label}
        {...props}
      />
    );
  }
);

AppIcon.displayName = 'AppIcon';

export default AppIcon;
