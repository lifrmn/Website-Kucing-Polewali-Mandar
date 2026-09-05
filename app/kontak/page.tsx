'use client'

import { useEffect, useState } from 'react'
import { Clock, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { defaultSiteSettings, type SiteSettings } from '@/lib/validations/settings'
import { toWhatsAppNumber } from '@/lib/whatsapp'

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings)

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setSettings(result.data)
      })
      .catch(() => undefined)
  }, [])

  const contactItems = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: settings.address,
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      content: settings.whatsapp,
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings.email,
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: `${settings.openDays} · ${settings.openHours}`,
    }
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Hubungi Kami
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Kami siap membantu Anda dengan segala kebutuhan perawatan kucing kesayangan
          </p>
        </div>
        {/* Wave bottom */}
        <div className="overflow-hidden mt-10" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-card shadow-sm hover:shadow-md transition-all duration-300 p-6 border hover:-translate-y-1" 
                  style={{ borderColor: '#E8E3DA' }}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 rounded-button flex items-center justify-center flex-shrink-0 bg-primary">
                      <Icon className={item.title === 'WhatsApp' ? 'text-[#128C4A]' : 'text-secondary'} size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#383838' }}>{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-base" style={{ color: '#707070' }}>{item.content}</p>
                </div>
              );
            })}
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-card shadow-md p-8 text-center border border-primary-hover">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
                <FaWhatsapp className="h-8 w-8 text-[#128C4A]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-text">Chat WhatsApp</h3>
              <p className="mb-6 text-muted">Hubungi tim Cikal Pet Care untuk informasi layanan, booking, dan produk.</p>
              <a
                href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-button bg-[#128C4A] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#0E743D]" 
              >
                <FaWhatsapp className="h-5 w-5" aria-hidden="true" /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#383838' }}>Lokasi Kami</h2>
          <div className="rounded-[20px] overflow-hidden shadow-md border-2" style={{ borderColor: '#E8E3DA' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127094.72!2d119.3388!3d-3.3244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d945e91f8f91f89%3A0x5e91f8f91f89!2sPolewali%20Mandar%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  )
}
