import { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { settingsService } from '@/services/settingsService'

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan yang Sering Diajukan | Cikal Pet Care Polman',
  description: 'Temukan jawaban untuk pertanyaan umum tentang layanan perawatan hewan peliharaan di Cikal Pet Care Polman',
  alternates: { canonical: '/faq' },
}

function getFaqs(paymentDescription: string) {
  return [
  {
    category: 'Layanan',
    questions: [
      {
        q: 'Apa saja layanan yang tersedia di Cikal Pet Care?',
        a: 'Daftar layanan yang sedang aktif, harga, dan durasinya ditampilkan pada halaman Layanan. Paket penitipan yang dapat dipesan tersedia pada halaman Booking.'
      },
      {
        q: 'Berapa lama waktu grooming hewan?',
        a: 'Durasi mengikuti jenis layanan, jenis hewan, dan kondisinya. Perkiraan durasi serta spesies yang didukung ditampilkan pada halaman Layanan.'
      },
      {
        q: 'Apakah harus booking terlebih dahulu?',
        a: 'Booking disarankan agar Anda mendapat slot yang tersedia. Untuk grooming, sistem hanya menerima jam yang masih tersedia pada tanggal pilihan.'
      },
    ]
  },
  {
    category: 'Pembayaran',
    questions: [
      {
        q: 'Metode pembayaran apa saja yang diterima?',
        a: paymentDescription
      },
      {
        q: 'Apakah harus bayar DP dulu?',
        a: 'Ketentuan pembayaran mengikuti instruksi yang tampil setelah pemesanan atau konfirmasi resmi dari Cikal Pet Care. Jangan mengirim pembayaran ke rekening yang tidak tercantum pada halaman Cara Pembayaran.'
      },
    ]
  },
  {
    category: 'Produk',
    questions: [
      {
        q: 'Apakah semua produk dijamin original?',
        a: 'Detail merek, varian, harga, dan stok yang tersedia ditampilkan pada halaman produk. Hubungi kami sebelum membeli jika Anda perlu memastikan distributor atau informasi kemasan tertentu.'
      },
      {
        q: 'Apakah ada garansi untuk produk yang dibeli?',
        a: 'Ketentuan pengembalian atau garansi bergantung pada jenis dan kondisi produk. Konfirmasikan ketentuannya sebelum checkout melalui kontak resmi kami.'
      },
    ]
  },
  ]
}

export default async function FAQPage() {
  const settings = await settingsService.getSiteSettings()
  const paymentMethods = [
    settings.bankAccount && settings.bankName ? `transfer ${settings.bankName}` : '',
    settings.qrisImageUrl ? 'QRIS' : '',
  ].filter(Boolean)
  const paymentDescription = paymentMethods.length > 0
    ? `Kami menerima pembayaran melalui ${paymentMethods.join(' dan ')}. Detail pembayaran yang berlaku ditampilkan pada halaman Cara Pembayaran.`
    : 'Metode pembayaran yang tersedia akan diinformasikan pada halaman Cara Pembayaran atau melalui WhatsApp.'
  const faqs = getFaqs(paymentDescription)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((section) => section.questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))),
  }
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Pertanyaan Umum
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Temukan jawaban untuk pertanyaan umum seputar layanan kami
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
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 md:py-20">
        <div className="space-y-6">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-bold mb-4 pb-3" style={{ color: '#383838', borderBottom: '2px solid #E6D18B' }}>
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((item, qIndex) => (
                  <details key={qIndex} className="rounded-[20px] shadow-md border-2 overflow-hidden" style={{ borderColor: '#E8E3DA', backgroundColor: 'white' }}>
                    <summary className="cursor-pointer p-5 md:p-6 flex items-center justify-between hover:bg-opacity-50 transition-colors" style={{ backgroundColor: '#FAF8F5' }}>
                      <span className="font-semibold text-lg" style={{ color: '#383838' }}>{item.q}</span>
                      <ChevronDown className="flex-shrink-0 ml-4" style={{ color: '#E6D18B' }} size={24} />
                    </summary>
                    <div className="p-5 md:p-6" style={{ color: '#707070', borderTop: '2px solid #E8E3DA' }}>
                      <p className="leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-[20px] p-8 md:p-10 text-center shadow-md" style={{ backgroundColor: 'white', borderColor: '#E8E3DA', borderWidth: '2px' }}>
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#383838' }}>Masih Ada Pertanyaan?</h3>
          <p className="mb-6" style={{ color: '#707070' }}>Hubungi kami langsung untuk bantuan lebih lanjut</p>
          <a
            href={getWhatsAppUrl(settings.whatsapp, 'Halo Cikal Pet Care, saya ingin bertanya mengenai layanan untuk hewan peliharaan saya.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-button bg-[#128C4A] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#0E743D]"
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden="true" /> Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
