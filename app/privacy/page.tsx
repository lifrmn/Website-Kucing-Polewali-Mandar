import { Metadata } from 'next'
import { Shield } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Cikal Pet Care Polman',
  description: 'Kebijakan privasi dan perlindungan data pribadi pelanggan Cikal Pet Care Polman',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-xl">
            <AppIcon icon={Shield} size="lg" className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-gray-600">
            Terakhir diperbarui: 18 Februari 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-fadeInUp">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Pendahuluan</h2>
            <p className="text-gray-600 leading-relaxed">
              Cikal Pet Care Polman ("kami", "kita") berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. 
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda ketika 
              menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Informasi yang Kami Kumpulkan</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Kami mengumpulkan informasi berikut ketika Anda menggunakan layanan kami:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Informasi Identitas:</strong> Nama lengkap, alamat email, nomor telepon</li>
              <li><strong>Informasi Hewan Peliharaan:</strong> Nama, jenis, ras, usia, kondisi kesehatan hewan</li>
              <li><strong>Informasi Transaksi:</strong> Riwayat pembelian, layanan yang digunakan, metode pembayaran</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, waktu akses</li>
              <li><strong>Informasi Komunikasi:</strong> Pesan, ulasan, feedback yang Anda berikan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Penggunaan Informasi</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Kami menggunakan informasi Anda untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Menyediakan dan meningkatkan layanan perawatan hewan peliharaan</li>
              <li>Memproses transaksi dan pembayaran</li>
              <li>Mengirimkan konfirmasi booking dan update layanan</li>
              <li>Memberikan customer support</li>
              <li>Mengirimkan promosi dan penawaran khusus (dengan persetujuan Anda)</li>
              <li>Menganalisis dan meningkatkan pengalaman pengguna</li>
              <li>Mematuhi kewajiban hukum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Perlindungan Data</h2>
            <p className="text-gray-600 leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang tepat untuk melindungi data pribadi Anda 
              dari akses tidak sah, kehilangan, penyalahgunaan, atau pengungkapan. Data Anda disimpan dalam sistem yang aman 
              dan hanya dapat diakses oleh personel yang berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Berbagi Informasi</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya berbagi informasi dengan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li><strong>Penyedia Layanan:</strong> Partner pembayaran, kurir pengiriman</li>
              <li><strong>Dokter Hewan:</strong> Untuk keperluan konsultasi kesehatan (dengan persetujuan Anda)</li>
              <li><strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookie dan Teknologi Pelacakan</h2>
            <p className="text-gray-600 leading-relaxed">
              Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna, menganalisis traffic, dan personalisasi konten. 
              Anda dapat mengatur browser Anda untuk menolak cookie, namun beberapa fitur website mungkin tidak berfungsi optimal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Hak Anda</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Mengakses dan memperoleh salinan data pribadi Anda</li>
              <li>Memperbarui atau mengoreksi data yang tidak akurat</li>
              <li>Menghapus data pribadi Anda (dengan batasan tertentu)</li>
              <li>Menolak atau membatasi pengolahan data</li>
              <li>Menarik persetujuan yang telah diberikan</li>
              <li>Mengajukan keluhan kepada otoritas perlindungan data</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak di bawah.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Penyimpanan Data</h2>
            <p className="text-gray-600 leading-relaxed">
              Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini atau 
              sesuai dengan kewajiban hukum. Data transaksi akan disimpan minimal 5 tahun untuk keperluan audit dan perpajakan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Perubahan Kebijakan</h2>
            <p className="text-gray-600 leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di website ini. 
              Kami akan memberitahu Anda tentang perubahan signifikan melalui email atau notifikasi di website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Hubungi Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak privasi Anda, 
              silakan hubungi kami:
            </p>
            <div className="bg-blue-50 rounded-xl p-6 space-y-2">
              <p className="font-bold text-gray-800">Cikal Pet Care Polman</p>
              <p className="text-gray-600">Email: privacy@cikalpetcare.com</p>
              <p className="text-gray-600">WhatsApp: +62 812-3456-7890</p>
              <p className="text-gray-600">Alamat: Jl. Jend. Sudirman, Polewali, Sulawesi Barat</p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Baca juga:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/terms"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              Syarat & Ketentuan
            </a>
            <a
              href="/faq"
              className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
