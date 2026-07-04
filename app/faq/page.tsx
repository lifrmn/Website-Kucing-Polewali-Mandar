import { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan yang Sering Diajukan | Cikal Pet Care Polman',
  description: 'Temukan jawaban untuk pertanyaan umum tentang layanan perawatan hewan peliharaan di Cikal Pet Care Polman',
}

const faqs = [
  {
    category: 'Layanan',
    questions: [
      {
        q: 'Apa saja layanan yang tersedia di Cikal Pet Care?',
        a: 'Kami menyediakan layanan grooming (mandi, potong kuku, styling), konsultasi kesehatan, vaksinasi, penitipan hewan (pet hotel), dan penjualan produk perawatan hewan berkualitas.'
      },
      {
        q: 'Berapa lama waktu grooming untuk kucing/anjing?',
        a: 'Untuk grooming dasar (mandi + potong kuku) membutuhkan waktu sekitar 1-2 jam tergantung ukuran dan kondisi hewan. Grooming lengkap dengan styling bisa memakan waktu 2-3 jam.'
      },
      {
        q: 'Apakah harus booking terlebih dahulu?',
        a: 'Sangat disarankan untuk booking terlebih dahulu agar kami bisa menyiapkan tim dan peralatan dengan optimal. Namun kami juga menerima walk-in customer jika slot masih tersedia.'
      },
    ]
  },
  {
    category: 'Pembayaran',
    questions: [
      {
        q: 'Metode pembayaran apa saja yang diterima?',
        a: 'Kami menerima pembayaran tunai, transfer bank (BRI, BNI, Mandiri), dan pembayaran digital melalui QRIS (Gopay, OVO, Dana, ShopeePay, LinkAja).'
      },
      {
        q: 'Apakah harus bayar DP dulu?',
        a: 'Untuk layanan grooming dan konsultasi tidak perlu DP. Namun untuk layanan pet hotel dan booking khusus (hari libur/weekend), kami meminta DP 30% sebagai konfirmasi booking.'
      },
    ]
  },
  {
    category: 'Produk',
    questions: [
      {
        q: 'Apakah semua produk dijamin original?',
        a: 'Ya, semua produk yang kami jual dijamin 100% original dari distributor resmi. Kami tidak menjual produk KW atau tiruan.'
      },
      {
        q: 'Apakah ada garansi untuk produk yang dibeli?',
        a: 'Untuk produk elektronik (seperti tempat makan otomatis, sisir elektrik) ada garansi toko 7 hari. Untuk produk makanan/snack, kami menjamin produk sesuai expired date yang tertera.'
      },
    ]
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
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
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#E6D18B' }}
          >
            💬 Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
