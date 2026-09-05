'use client';

import Link from 'next/link';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import SocialMediaBar, { type SocialMediaLinks } from './SocialMediaBar';
import { PawPrint } from 'lucide-react';
import { useSiteSettings } from './SiteSettingsContext';

export default function Footer() {
  const settings = useSiteSettings();

  const socialLinks: SocialMediaLinks = {
    instagram: settings.instagram || undefined,
    facebook: settings.facebook || undefined,
    tiktok: settings.tiktok || undefined,
    youtube: settings.youtube || undefined,
  };

  return (
    <footer style={{ backgroundColor: '#6C6C6C', fontFamily: "'Poppins', sans-serif" }} className="text-white relative z-10">
      {/* Wave top divider */}
      <div className="overflow-hidden leading-none" style={{ marginTop: '-2px' }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="#3b3a2e" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-8 pb-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E6D18B' }}
          >
            <PawPrint size={26} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">{settings.siteName}</p>
            <p className="text-white/60 text-xs mt-0.5">Polewali Mandar</p>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
          {/* Alamat */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Alamat</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-white/50" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="flex-shrink-0 text-white/50" />
                <span>{settings.openDays}: {settings.openHours}</span>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0 text-white/50" />
                <a href={`tel:${settings.whatsapp}`} className="hover:text-white transition-colors">{settings.whatsapp}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0 text-white/50" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
              </li>
            </ul>
            <div className="mt-6">
              <SocialMediaBar socialLinks={socialLinks} />
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/layanan" className="hover:text-white transition-colors">Grooming &amp; Perawatan</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Penitipan Kucing</Link></li>
              <li><Link href="/produk" className="hover:text-white transition-colors">Produk &amp; Aksesori</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Tips Kesehatan</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors">Kontak Kami</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-8 text-center">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} <span className="text-white/80 font-semibold">{settings.siteName}</span> — Polewali Mandar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
