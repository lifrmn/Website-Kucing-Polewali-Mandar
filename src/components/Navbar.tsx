'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PawPrint, X } from 'lucide-react';
import CartButton from './CartButton';
import AppIcon from './AppIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/produk', label: 'Produk' },
    { path: '/layanan', label: 'Layanan' },
    { path: '/booking', label: 'Booking' },
    { path: '/pesanan', label: 'Pesanan' },
    { path: '/blog', label: 'Tips Kesehatan' },
    { path: '/kontak', label: 'Kontak' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isTransparent = pathname === '/' && !scrolled && !isOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'border-b'
      }`}
      style={!isTransparent ? { backgroundColor: 'rgba(250,248,245,0.96)', backdropFilter: 'blur(14px)', borderColor: 'var(--color-border)', boxShadow: '0 4px 20px rgba(47,46,37,0.06)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-[20px] sm:px-[24px] lg:px-[32px]">
        <nav className="flex items-center justify-between" style={{ height: '80px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[12px] flex-shrink-0 group transition-all duration-300 hover:opacity-80">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 bg-primary">
              <PawPrint size={22} className="text-secondary" />
            </div>
            <div className="hidden min-[360px]:flex flex-col leading-tight min-w-fit">
              <span className={`text-base font-bold transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-text'}`}>
                Cikal Pet Care
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${isTransparent ? 'text-white/70' : 'text-muted'}`}>
                Polewali Mandar
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1 flex-grow justify-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`relative inline-flex min-h-11 items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    isActive(link.path)
                      ? isTransparent
                        ? 'text-white bg-white/15'
                        : 'text-secondary bg-primary/30'
                      : isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-muted hover:text-text hover:bg-surface2'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* Cart Button */}
            <li className="ml-2">
              <CartButton variant="desktop" />
            </li>
            <li className="ml-1">
              <Link href="/booking" className="inline-flex min-h-11 items-center rounded-button bg-primary px-5 text-sm font-semibold text-[#2A2A1A] hover:bg-primary-hover">
                Booking Sekarang
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button & Cart */}
          <div className="flex items-center gap-[8px] lg:hidden">
            <CartButton variant="mobile" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`h-11 w-11 flex items-center justify-center rounded-button transition-colors ${isTransparent ? 'bg-white/10 text-white' : 'bg-surface2 text-text'}`}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
            >
              <AppIcon icon={isOpen ? X : Menu} size="lg" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-bg/98 backdrop-blur-md">
            <ul className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center py-3 px-4 font-medium rounded-lg transition-colors text-sm ${
                      isActive(link.path)
                        ? 'text-secondary bg-primary/30 border-l-[3px] border-primary-hover'
                        : 'text-muted hover:bg-surface2 hover:text-text border-l-[3px] border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/booking" onClick={() => setIsOpen(false)} className="flex min-h-12 items-center justify-center rounded-button bg-primary px-5 font-semibold text-[#2A2A1A] hover:bg-primary-hover">
                  Booking Sekarang
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
