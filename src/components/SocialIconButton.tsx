import { Instagram, Facebook, Youtube, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={cn('flex-shrink-0', className)} 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube';
export type SocialVariant = 'solid' | 'soft';

interface SocialIconButtonProps {
  platform: SocialPlatform;
  href?: string;
  variant?: SocialVariant;
  disabled?: boolean;
  ariaLabel?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

// Platform configurations with brand colors
const platformConfig: Record<SocialPlatform, {
  icon: LucideIcon | React.FC<{ className?: string }>;
  label: string;
  solid: {
    bg: string;
    hover: string;
    icon: string;
    ring: string;
  };
  soft: {
    bg: string;
    hover: string;
    icon: string;
    ring: string;
  };
}> = {
  instagram: {
    icon: Instagram,
    label: 'Instagram',
    solid: {
      bg: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      hover: 'hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
      icon: 'text-white',
      ring: 'focus:ring-pink-500',
    },
    soft: {
      bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
      hover: 'hover:from-purple-100 hover:via-pink-100 hover:to-orange-100',
      icon: 'text-pink-600',
      ring: 'focus:ring-pink-400',
    },
  },
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    solid: {
      bg: 'bg-[#1877F2]',
      hover: 'hover:bg-[#0c63d4]',
      icon: 'text-white',
      ring: 'focus:ring-blue-500',
    },
    soft: {
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100',
      icon: 'text-[#1877F2]',
      ring: 'focus:ring-blue-400',
    },
  },
  tiktok: {
    icon: TikTokIcon,
    label: 'TikTok',
    solid: {
      bg: 'bg-black',
      hover: 'hover:bg-gray-900',
      icon: 'text-white',
      ring: 'focus:ring-cyan-400',
    },
    soft: {
      bg: 'bg-gray-900',
      hover: 'hover:bg-gray-800',
      icon: 'text-white',
      ring: 'focus:ring-cyan-400',
    },
  },
  youtube: {
    icon: Youtube,
    label: 'YouTube',
    solid: {
      bg: 'bg-[#FF0000]',
      hover: 'hover:bg-[#cc0000]',
      icon: 'text-white',
      ring: 'focus:ring-red-500',
    },
    soft: {
      bg: 'bg-red-50',
      hover: 'hover:bg-red-100',
      icon: 'text-[#FF0000]',
      ring: 'focus:ring-red-400',
    },
  },
};

export default function SocialIconButton({
  platform,
  href,
  variant = 'soft',
  disabled = false,
  ariaLabel,
  onMouseEnter,
  onMouseLeave,
  className,
}: SocialIconButtonProps) {
  const config = platformConfig[platform];
  const style = config[variant];
  const IconComponent = config.icon;

  const buttonClasses = cn(
    // Base styles
    'h-14 w-14 rounded-xl flex items-center justify-center',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    style.ring,
    // Variant-specific styles
    style.bg,
    !disabled && style.hover,
    !disabled && 'active:scale-95 shadow-sm hover:shadow-md',
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && 'pointer-events-auto',
    className
  );

  const iconClasses = cn(
    'pointer-events-none',
    style.icon
  );

  if (disabled || !href) {
    return (
      <div
        className={buttonClasses}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={disabled ? 'Link belum diatur' : undefined}
      >
        {'icon' in IconComponent ? (
          <IconComponent className={cn(iconClasses, 'w-5 h-5')} />
        ) : (
          <IconComponent className={iconClasses} />
        )}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || `Ikuti kami di ${config.label}`}
      className={buttonClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {'icon' in IconComponent ? (
        <IconComponent className={cn(iconClasses, 'w-5 h-5')} />
      ) : (
        <IconComponent className={iconClasses} />
      )}
    </a>
  );
}
