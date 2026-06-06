import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export default function ContactPage() {
  const contactItems = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Darma, Kec. Polewali, Kabupaten Polewali Mandar, Sulawesi Barat 91311',
      gradient: 'from-red-500 via-rose-500 to-pink-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-gradient-to-br from-red-500 to-pink-600',
      emoji: '📍'
    },
    {
      icon: Phone,
      title: 'Telepon/WhatsApp',
      content: '0852-5547-8706',
      gradient: 'from-blue-500 via-indigo-500 to-violet-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-violet-600',
      emoji: '📱'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@cikalpetcare.com',
      gradient: 'from-cyan-500 via-blue-500 to-sky-600',
      bgColor: 'bg-cyan-50',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      emoji: '✉️'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Minggu: 08:00 - 20:00',
      gradient: 'from-purple-500 via-pink-500 to-rose-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-rose-600',
      emoji: '⏰'
    }
  ];

  return (
    <div className="relative pt-24 sm:pt-36 lg:pt-44 pb-16 sm:pb-24 lg:pb-32 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-blob" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-fuchsia-500/15 rounded-full blur-3xl animate-blob" style={{animationDelay: '4s'}}></div>
      
      <div className="container relative z-10 px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-18 animate-fadeInUp">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-2xl text-xs sm:text-sm font-bold mb-6 shadow-2xl animate-pulse-slow border-2 border-white/30">
            <span className="text-lg">📞</span>
            <span>Hubungi Kami</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
            Hubungi Kami Sekarang!
          </h1>
          <p className="text-gray-700 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            🐱 Kami siap membantu Anda dengan segala kebutuhan perawatan kucing kesayangan ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="w-2 h-10 bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-600 rounded-full shadow-lg"></span>
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              {contactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp border-2 border-gray-100 hover:border-purple-300 overflow-hidden"
                    style={{ animationDelay: `${(index + 2) * 100}ms` }}
                  >
                    <div className={`${item.bgColor} px-6 py-4 border-b-2 border-gray-100`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex-shrink-0 ${item.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                          <AppIcon icon={Icon} size="md" className="text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-extrabold text-xl text-gray-800">{item.title}</h3>
                      </div>
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-base text-gray-700 leading-relaxed break-words font-medium">{item.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl animate-fadeInUp overflow-hidden group hover:scale-105 transition-all duration-500 border-2 border-green-400/50" style={{ animationDelay: '600ms' }}>
              {/* Animated circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <AppIcon icon={MessageCircle} size="lg" className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Chat Langsung di WhatsApp Anda!
                  </h3>
                </div>
                <p className="text-green-50 mb-6 leading-relaxed text-base font-medium">✨ Hubungi kami via WhatsApp untuk respons super cepat dan friendly! 🚀</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full py-5 px-6 bg-white hover:bg-green-50 text-green-600 font-extrabold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 border-2 border-white"
                >
                  <AppIcon icon={Phone} size="md" strokeWidth={2.5} />
                  <span className="leading-none">Hubungi WhatsApp Sekarang</span>
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-3">
              <span className="w-2 h-10 bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-600 rounded-full shadow-lg"></span>
              Lokasi Kami
            </h2>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127094.72!2d119.3388!3d-3.3244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d945e91f8f91f89%3A0x5e91f8f91f89!2sPolewali%20Mandar%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-8 bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AppIcon icon={MapPin} size="md" className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-2xl text-gray-800">
                  Cara Menemukan Kami
                </h3>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="leading-relaxed text-base font-medium pt-2">Lokasi strategis di pusat kota Polewali</span>
                </li>
                <li className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="leading-relaxed text-base font-medium pt-2">Akses mudah dari jalan utama</span>
                </li>
                <li className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="leading-relaxed text-base font-medium pt-2">Area parkir tersedia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
