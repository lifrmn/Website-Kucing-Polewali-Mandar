'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import SocialIconButton, { type SocialPlatform } from './SocialIconButton';

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

interface SocialItem {
  id: SocialPlatform;
  name: string;
  url: string | null;
  ariaLabel: string;
}

interface SocialMediaBarProps {
  socialLinks?: SocialMediaLinks;
  className?: string;
}

export default function SocialMediaBar({ socialLinks, className }: SocialMediaBarProps) {
  const [hoveredDisabled, setHoveredDisabled] = useState<string | null>(null);

  // Build social items array with proper URLs
  const socialItems: SocialItem[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      url: socialLinks?.instagram || null,
      ariaLabel: 'Ikuti kami di Instagram',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: socialLinks?.facebook || null,
      ariaLabel: 'Ikuti kami di Facebook',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: socialLinks?.tiktok || null,
      ariaLabel: 'Ikuti kami di TikTok',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: socialLinks?.youtube || null,
      ariaLabel: 'Subscribe channel YouTube kami',
    },
  ];

  return (
    <div 
      className={cn(
        'relative inline-flex flex-wrap items-center gap-3',
        'max-w-fit z-20',
        className
      )}
    >
      {socialItems.map((item) => {
        const isDisabled = !item.url;
        const isHovered = hoveredDisabled === item.id;

        return (
          <div key={item.id} className="relative">
            {/* Tooltip for disabled state */}
            {isDisabled && isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-30">
                Link belum diatur
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}

            <SocialIconButton
              platform={item.id}
              href={item.url || undefined}
              variant="soft"
              disabled={isDisabled}
              ariaLabel={item.ariaLabel}
              onMouseEnter={isDisabled ? () => setHoveredDisabled(item.id) : undefined}
              onMouseLeave={isDisabled ? () => setHoveredDisabled(null) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
