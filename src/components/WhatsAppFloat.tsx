'use client'

import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useSiteSettings } from './SiteSettingsContext';
import { toWhatsAppNumber } from '@/lib/whatsapp';

export default function WhatsAppFloat() {
  const settings = useSiteSettings();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver to detect footer visibility
  useEffect(() => {
    const observeFooter = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      footerObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsFooterVisible(entry.isIntersecting);
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      footerObserverRef.current.observe(footer);
    };

    // Delay observation to ensure footer is rendered
    const timer = setTimeout(observeFooter, 100);

    return () => {
      clearTimeout(timer);
      if (footerObserverRef.current) {
        footerObserverRef.current.disconnect();
      }
    };
  }, []);

  const handleClick = () => {
    setShowTooltip(false);
    const message = encodeURIComponent(
      'Halo Admin Cikal Pet Care Polman,\n\nSaya ingin bertanya tentang layanan Cikal Pet Care. Terima kasih.'
    );
    window.open(`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}?text=${message}`, '_blank');
  };

  return (
    <div 
      className={cn(
        'fixed right-4 sm:right-6 bottom-24 sm:bottom-6 z-30 transition-all duration-200',
        isFooterVisible ? 'translate-y-4 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip Bubble */}
      <div 
        className={cn(
          'hidden sm:block absolute bottom-full right-0 mb-3 transition-all duration-200 pointer-events-none z-40',
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      >
        <div className="relative bg-secondary text-white px-4 py-2.5 rounded-button shadow-lg max-w-[220px]">
          <p className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
            <FaWhatsapp aria-hidden="true" /> Chat via WhatsApp
          </p>
          {/* Arrow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#3B3A2E]"></div>
        </div>
      </div>
      
      {/* Button - Simple, no overlays or large shadows */}
      <button
        onClick={handleClick}
        className={cn(
          'bg-[#25D366] text-white hover:bg-[#1EBE5D]',
          'h-14 w-14 sm:h-[60px] sm:w-[60px] rounded-full',
          'shadow-md hover:shadow-lg',
          'transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
          'flex items-center justify-center',
          'pointer-events-auto',
          'focus:outline-none focus:ring-2 focus:ring-[#128C4A] focus:ring-offset-2'
        )}
        title="Chat WhatsApp"
        aria-label="Chat via WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7 sm:h-8 sm:w-8 pointer-events-none" aria-hidden="true" />
      </button>
    </div>
  );
}
