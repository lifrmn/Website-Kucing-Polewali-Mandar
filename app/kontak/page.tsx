'use client'

import { MapPin, Phone, Clock, Mail } from 'lucide-react'

export default function ContactPage() {
  const contactItems = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Darma, Kec. Polewali, Kabupaten Polewali Mandar, Sulawesi Barat 91311',
      emoji: '📍'
    },
    {
      icon: Phone,
      title: 'Telepon/WhatsApp',
      content: '0852-5547-8706',
      emoji: '📱'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@cikalpetcare.com',
      emoji: '✉️'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Minggu: 08:00 - 20:00',
      emoji: '⏰'
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
                  className="bg-white rounded-[20px] shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 hover:scale-105" 
                  style={{ borderColor: '#E8E3DA' }}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[15px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6D18B' }}>
                      <Icon className="text-white" size={24} />
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
            <div className="bg-white rounded-[20px] shadow-md p-8 text-center border-2" style={{ borderColor: '#E6D18B' }}>
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#383838' }}>Chat Langsung</h3>
              <p className="mb-6" style={{ color: '#707070' }}>Hubungi kami via WhatsApp untuk respons super cepat dan friendly!</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-opacity w-full" 
                style={{ backgroundColor: '#E6D18B' }}
              >
                Hubungi WhatsApp Sekarang
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
