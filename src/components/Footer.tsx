'use client';

import Link from 'next/link';
import { MapPin, Clock, Mail, PawPrint } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SocialMediaBar, { type SocialMediaLinks } from './SocialMediaBar';
import { useSiteSettings } from './SiteSettingsContext';
import { toWhatsAppNumber } from '@/lib/whatsapp';

export default function Footer() {
  const settings = useSiteSettings();

  const socialLinks: SocialMediaLinks = {
    instagram: settings.instagram || undefined,
    facebook: settings.facebook || undefined,
    tiktok: settings.tiktok || undefined,
    youtube: settings.youtube || undefined,
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#2F2E25] text-white">
      <div className="container-premium pt-14 pb-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
            <PawPrint size={26} className="text-secondary" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">{settings.siteName}</p>
            <p className="text-white/60 text-xs mt-0.5">Polewali Mandar</p>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
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
                <FaWhatsapp className="flex-shrink-0 text-[#25D366]" aria-hidden="true" />
                <a href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{settings.whatsapp}</a>
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

          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link href="/cara-pembayaran" className="hover:text-white transition-colors">Cara Pembayaran</Link></li>
              <li><Link href="/pesanan" className="hover:text-white transition-colors">Lacak Pesanan</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</Link></li>
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
