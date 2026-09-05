import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Cikal Pet Care Polman',
  description: 'Syarat dan ketentuan penggunaan layanan Cikal Pet Care Polman',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Poppins','Inter',sans-serif" }}>
      <section className="pb-10 pt-28 md:pt-32" style={{ backgroundColor: '#3b3a2e' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#E6D18B' }}>Cikal Pet Care</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Ketentuan penggunaan layanan Cikal Pet Care
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 py-12 md:py-16">
        <div className="bg-white rounded-card shadow-sm p-6 md:p-10 space-y-8 border border-border">
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>1. Penerimaan Syarat</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Dengan mengakses dan menggunakan layanan Cikal Pet Care Polman, Anda menyetujui untuk terikat dengan 
              Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>2. Layanan</h2>
            <p className="leading-relaxed mb-3" style={{ color: '#707070' }}>
              Cikal Pet Care menyediakan layanan:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#707070' }}>
              <li>Grooming (mandi, potong kuku, dan perawatan bulu) untuk kucing</li>
              <li>Konsultasi kesehatan dan vaksinasi</li>
              <li>Pet hotel (penitipan hewan)</li>
              <li>Penjualan produk perawatan hewan (makanan, aksesoris, obat-obatan)</li>
            </ul>
            <p className="leading-relaxed mt-3" style={{ color: '#707070' }}>
              Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>3. Tanggung Jawab Pelanggan</h2>
            <p className="leading-relaxed mb-3" style={{ color: '#707070' }}>
              Sebagai pelanggan, Anda bertanggung jawab untuk:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#707070' }}>
              <li>Memberikan informasi yang akurat dan lengkap</li>
              <li>Membayar semua biaya sesuai dengan harga yang telah disepakati</li>
              <li>Memberikan vaksinasi yang diperlukan untuk hewan peliharaan Anda</li>
              <li>Mematuhi semua kebijakan dan peraturan kami</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>4. Pembayaran</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Semua pembayaran harus diselesaikan sesuai dengan metode dan waktu yang telah disepakati. 
              Kami menerima tunai, transfer bank, dan pembayaran digital (QRIS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>5. Pembatasan Tanggung Jawab</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Cikal Pet Care tidak bertanggung jawab atas kehilangan, kerusakan, atau luka yang disebabkan oleh 
              faktor di luar kendali kami. Kami tidak bertanggung jawab atas reaksi alergi atau efek samping 
              dari produk atau layanan tertentu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#383838' }}>6. Kebijakan Pembatalan</h2>
            <p className="leading-relaxed" style={{ color: '#707070' }}>
              Pembatalan dapat dilakukan minimal 24 jam sebelum jadwal layanan. 
              Pembatalan kurang dari 24 jam akan dikenakan biaya pembatalan sebesar 50% dari total harga layanan.
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
