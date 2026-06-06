'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import AppIcon from './AppIcon';

interface CartButtonProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * Standardized cart button component.
 * 
 * Specifications:
 * - Desktop: 44x44px rounded-xl
 * - Mobile: 40x40px rounded-lg
 * - Background: Primary color with shadow
 * - Icon: White, 20px with strokeWidth 2
 * - Badge: Small circle at top-right corner
 * - Hover: Subtle scale and shadow increase
 * 
 * @example
 * <CartButton variant="desktop" />
 * <CartButton variant="mobile" />
 */
export default function CartButton({ variant = 'desktop', className }: CartButtonProps) {
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className={cn(
        'relative flex items-center justify-center bg-primary text-white',
        'transition-all duration-200',
        'hover:bg-primary-hover hover:shadow-lg hover:scale-105',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'active:scale-95',
        variant === 'desktop' 
          ? 'h-11 w-11 rounded-xl shadow-md' 
          : 'h-10 w-10 rounded-lg shadow-sm',
        className
      )}
      aria-label={`Keranjang belanja - ${itemCount} item`}
    >
      <AppIcon 
        icon={ShoppingCart} 
        size="md" 
        strokeWidth={2}
        className="text-white"
      />
      
      {itemCount > 0 && (
        <span 
          className={cn(
            'absolute flex items-center justify-center',
            'bg-red-500 text-white font-bold',
            'rounded-full shadow-md',
            'ring-2 ring-white',
            variant === 'desktop' 
              ? '-top-1.5 -right-1.5 h-5 w-5 text-xs' 
              : '-top-1 -right-1 h-4 w-4 text-[10px]'
          )}
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
