'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import CartButton from './CartButton';
import IconBadge from './IconBadge';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg border-b border-gray-200' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
            <IconBadge 
              icon={PawPrint} 
              variant="primary" 
              size="md"
              className="shadow-md group-hover:shadow-lg transition-all duration-300"
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-gray-900">
                Cikal Pet Care
              </span>
              <span className="text-xs text-gray-500 font-medium mt-0.5">Polewali Mandar</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`inline-flex items-center gap-2 font-medium transition-all duration-200 px-4 py-2 rounded-lg text-sm relative group leading-none ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-0.5 left-4 right-4 h-0.5 bg-blue-600 transition-all duration-200 ${
                    isActive(link.path) ? 'w-auto' : 'w-0 group-hover:w-auto group-hover:left-4 group-hover:right-4'
                  }`}></span>
                </Link>
              </li>
            ))}
            
            {/* Cart Button */}
            <li className="ml-2">
              <CartButton variant="desktop" />
            </li>
          </ul>

          {/* Mobile Menu Button & Cart */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartButton variant="mobile" />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <AppIcon 
                icon={isOpen ? X : Menu} 
                size="lg"
                className="text-gray-700"
              />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 py-3 px-4 font-medium rounded-lg transition-colors text-sm leading-none ${
                      isActive(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
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
