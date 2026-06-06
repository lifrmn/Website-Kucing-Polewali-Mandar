import Link from 'next/link';
import { Phone, MapPin, Clock } from 'lucide-react';
import SocialMediaBar, { type SocialMediaLinks } from './SocialMediaBar';
import IconBadge from './IconBadge';
import { PawPrint } from 'lucide-react';
import AppIcon from './AppIcon';
import { settingsService } from '@/services/settingsService';

export default async function Footer() {
  // Fetch social media links from database
  const socialLinks: SocialMediaLinks = await settingsService.getSocialMediaLinks();

  return (
    <footer className="bg-gray-900 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* About */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-5">
              <IconBadge 
                icon={PawPrint} 
                variant="primary" 
                size="md"
                className="shadow-md"
              />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-white">Cikal Pet Care</span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">Polewali Mandar</span>
              </div>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              Konsultan kesehatan kucing terpercaya di Sulawesi Barat dengan layanan profesional dan fasilitas modern.
            </p>
            <div className="max-w-fit">
              <SocialMediaBar socialLinks={socialLinks} />
            </div>
          </div>

          {/* Layanan */}
          <div className="min-w-0">
            <h3 className="text-base font-bold mb-5 text-white">
              Layanan Kami
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/layanan" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Penitipan Kucing
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Grooming & Perawatan
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Konsultasi Kesehatan
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Operasi & Vaksinasi
                </Link>
              </li>
              <li>
                <Link href="/produk" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Produk & Perlengkapan
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div className="min-w-0">
            <h3 className="text-base font-bold mb-5 text-white">
              Informasi
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Tips Kesehatan
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/cara-pembayaran" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Cara Pembayaran
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm relative z-10">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="min-w-0">
            <h3 className="text-base font-bold mb-5 text-white">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconBadge 
                  icon={MapPin} 
                  variant="soft" 
                  size="sm"
                  className="mt-0.5"
                  iconClassName="text-blue-400"
                />
                <span className="text-sm leading-relaxed text-gray-400">
                  Darma, Kec. Polewali, Kabupaten Polewali Mandar, Sulawesi Barat 91311
                </span>
              </li>
              <li className="flex items-center gap-3">
                <IconBadge 
                  icon={Phone} 
                  variant="soft" 
                  size="sm"
                  iconClassName="text-blue-400"
                />
                <a href="tel:0852-5547-8706" className="hover:text-white transition-colors font-semibold text-sm text-gray-400">
                  0852-5547-8706
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconBadge 
                  icon={Clock} 
                  variant="soft" 
                  size="sm"
                  className="mt-0.5"
                  iconClassName="text-blue-400"
                />
                <div className="text-sm text-gray-400">
                  <p className="font-semibold">Senin - Minggu</p>
                  <p>08:00 - 20:00 WITA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              &copy; 2026 <span className="font-semibold text-white">Cikal Pet Care</span>. All rights reserved.
            </p>
            <p>
              Made with ❤️ for Happy Cats
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
