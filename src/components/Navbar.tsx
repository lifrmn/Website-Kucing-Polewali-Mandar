'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import CartButton from './CartButton';
import AppIcon from './AppIcon';
import { PawPrint } from 'lucide-react';

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b'
          : 'bg-transparent border-b border-white/10'
      }`}
      style={{
        fontFamily: "'Poppins', sans-serif",
        borderColor: scrolled ? '#E8E3DA' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <nav className="flex items-center justify-between" style={{ height: '80px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group transition-all duration-300 hover:opacity-80">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
              style={{ backgroundColor: '#E6D18B' }}
            >
              <PawPrint size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight min-w-fit">
              <span
                className="text-base font-bold transition-colors duration-300"
                style={{ color: scrolled ? '#383838' : 'white' }}
              >
                Cikal Pet Care
              </span>
              <span
                className="text-xs font-medium transition-colors duration-300"
                style={{ color: scrolled ? '#707070' : 'rgba(255,255,255,0.7)' }}
              >
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
                  className={`relative inline-flex items-center px-5 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive(link.path)
                      ? scrolled
                        ? 'text-[#383838] bg-[#F3EFE8]'
                        : 'text-white bg-white/20'
                      : scrolled
                        ? 'text-[#707070] hover:text-[#383838] hover:bg-[#F3EFE8]'
                        : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* Cart Button */}
            <li className="ml-4">
              <CartButton variant="desktop" />
            </li>
          </ul>

          {/* Mobile Menu Button & Cart */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton variant="mobile" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 flex items-center justify-center rounded-lg transition-colors"
              style={{
                backgroundColor: scrolled ? '#F3EFE8' : 'rgba(255,255,255,0.1)',
                color: scrolled ? '#383838' : 'white',
              }}
              aria-label="Toggle menu"
            >
              <AppIcon icon={isOpen ? X : Menu} size="lg" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden py-4 border-t"
            style={{
              backgroundColor: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(12px)',
              borderColor: '#E8E3DA',
            }}
          >
            <ul className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center py-3 px-4 font-medium rounded-lg transition-colors text-sm ${
                      isActive(link.path)
                        ? 'text-[#383838] bg-[#F3EFE8]'
                        : 'text-[#707070] hover:bg-[#F3EFE8] hover:text-[#383838]'
                    }`}
                    style={isActive(link.path) ? { borderLeft: '3px solid #E6D18B' } : {}}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
