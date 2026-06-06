'use client'

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import AppIcon from './AppIcon';
import { cn } from '@/lib/utils';

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285255478706';

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setShowTooltip(false);
      setIsVisible(false);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    // Show tooltip after 2 seconds on mount
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    // Hide tooltip after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 7000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(tooltipTimer);
      clearTimeout(hideTimer);
      clearTimeout(scrollTimeout);
    };
  }, []);

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
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div 
      className={cn(
        'fixed right-6 z-30 transition-all duration-300',
        // Auto-adjust position when footer is visible to prevent overlap
        isFooterVisible ? 'bottom-28 sm:bottom-28' : 'sm:bottom-6 bottom-20',
        isVisible ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip Bubble */}
      <div 
        className={cn(
          'absolute bottom-full right-0 mb-3 transition-all duration-300 pointer-events-none z-40',
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      >
        <div className="relative bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg max-w-[200px]">
          <p className="text-sm font-medium whitespace-nowrap">
            💬 Chat dengan Kami
          </p>
          {/* Arrow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
        </div>
      </div>
      
      {/* Button - Simple, no overlays or large shadows */}
      <button
        onClick={handleClick}
        className={cn(
          'bg-[#25D366] text-white',
          'h-14 w-14 sm:h-16 sm:w-16 rounded-full',
          'shadow-md hover:shadow-lg',
          'transition-all duration-200 hover:scale-[1.02] active:scale-95',
          'flex items-center justify-center',
          'pointer-events-auto',
          'focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2'
        )}
        title="Chat WhatsApp"
        aria-label="Chat via WhatsApp"
      >
        {/* Icon Only - No overlays, no animations */}
        <AppIcon 
          icon={MessageCircle} 
          size="xl"
          strokeWidth={1.5}
          className="text-white pointer-events-none"
        />
      </button>
    </div>
  );
}
