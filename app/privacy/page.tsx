import { Metadata } from 'next'
import { Shield } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Cikal Pet Care Polman',
  description: 'Kebijakan privasi dan perlindungan data pribadi pelanggan Cikal Pet Care Polman',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-14" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Kebijakan Privasi
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Perlindungan dan keamanan data pribadi Anda adalah prioritas kami
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
        <div className="bg-white rounded-[20px] shadow-md p-8 md:p-12 space-y-8" style={{ borderColor: '#E8E3DA', borderWidth: '2px' }}>
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>1. Pendahuluan</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Cikal Pet Care Polman ("kami", "kita") berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. 
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda ketika 
              menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>2. Informasi yang Kami Kumpulkan</h2>
            <p className="leading-relaxed mb-3" style={{ color: '#707070' }}>
              Kami mengumpulkan informasi berikut ketika Anda menggunakan layanan kami:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#707070' }}>
              <li><strong>Informasi Identitas:</strong> Nama lengkap, alamat email, nomor telepon</li>
              <li><strong>Informasi Hewan Peliharaan:</strong> Nama, jenis, ras, usia, kondisi kesehatan hewan</li>
              <li><strong>Informasi Transaksi:</strong> Riwayat pembelian, layanan yang digunakan, metode pembayaran</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, waktu akses</li>
              <li><strong>Informasi Komunikasi:</strong> Pesan, ulasan, feedback yang Anda berikan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>3. Penggunaan Informasi</h2>
            <p className="leading-relaxed mb-3" style={{ color: '#707070' }}>
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#707070' }}>
              <li>Memberikan dan meningkatkan layanan kami</li>
              <li>Menghubungi Anda terkait pesanan atau pertanyaan</li>
              <li>Mengirim promosi dan penawaran khusus (jika Anda setuju)</li>
              <li>Mencegah fraud dan memastikan keamanan layanan</li>
              <li>Memenuhi kewajiban hukum dan peraturan yang berlaku</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>4. Keamanan Data</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Kami menggunakan enkripsi dan protokol keamanan untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran yang tidak disengaja. Namun, tidak ada metode transmisi internet yang 100% aman.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>5. Kontak Kami</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di: <strong style={{ color: '#E6D18B' }}>info@cikalpetcare.com</strong>
            </p>
          </section>

          <div className="text-sm text-center pt-6" style={{ color: '#707070', borderTop: '1px solid #E8E3DA' }}>
            <p>Terakhir diperbarui: 18 Februari 2026</p>
          </div>
        </div>
      </div>
    </main>
  )
}
