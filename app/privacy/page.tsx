import { Metadata } from 'next'
import { settingsService } from '@/services/settingsService'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Cikal Pet Care Polman',
  description: 'Kebijakan privasi dan perlindungan data pribadi pelanggan Cikal Pet Care Polman',
}

export default async function PrivacyPolicyPage() {
  const settings = await settingsService.getSiteSettings()
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      <section className="pb-10 pt-28 md:pt-32" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Perlindungan dan keamanan data pribadi Anda adalah prioritas kami
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 py-12 md:py-16">
        <div className="bg-white rounded-card shadow-sm p-6 md:p-10 space-y-8 border border-border">
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
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:{' '}
              <a href={`mailto:${settings.email}`} className="font-semibold text-dark-gold hover:text-secondary">{settings.email}</a>
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
