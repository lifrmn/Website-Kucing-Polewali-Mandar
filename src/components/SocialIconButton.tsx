import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

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
  icon: IconType;
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
    icon: FaInstagram,
    label: 'Instagram',
    solid: {
      bg: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      hover: 'hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
      icon: 'text-white',
      ring: 'focus:ring-pink-500',
    },
    soft: {
      bg: 'bg-white/10',
      hover: 'hover:bg-white/15',
      icon: 'text-[#E1306C]',
      ring: 'focus:ring-pink-400',
    },
  },
  facebook: {
    icon: FaFacebookF,
    label: 'Facebook',
    solid: {
      bg: 'bg-[#1877F2]',
      hover: 'hover:bg-[#0c63d4]',
      icon: 'text-white',
      ring: 'focus:ring-blue-500',
    },
    soft: {
      bg: 'bg-white/10',
      hover: 'hover:bg-white/15',
      icon: 'text-[#1877F2]',
      ring: 'focus:ring-blue-400',
    },
  },
  tiktok: {
    icon: FaTiktok,
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
    icon: FaYoutube,
    label: 'YouTube',
    solid: {
      bg: 'bg-[#FF0000]',
      hover: 'hover:bg-[#cc0000]',
      icon: 'text-white',
      ring: 'focus:ring-red-500',
    },
    soft: {
      bg: 'bg-white/10',
      hover: 'hover:bg-white/15',
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
        <IconComponent className={cn(iconClasses, 'h-5 w-5')} aria-hidden="true" />
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
      <IconComponent className={cn(iconClasses, 'h-5 w-5')} aria-hidden="true" />
    </a>
  );
}
