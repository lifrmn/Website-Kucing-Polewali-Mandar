import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import AppIcon from '@/components/AppIcon'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Cikal Pet Care Polman',
  description: 'Syarat dan ketentuan penggunaan layanan Cikal Pet Care Polman',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-6 shadow-xl">
            <AppIcon icon={FileText} size="lg" className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-gray-600">
            Terakhir diperbarui: 18 Februari 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-fadeInUp">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Penerimaan Syarat</h2>
            <p className="text-gray-600 leading-relaxed">
              Dengan mengakses dan menggunakan layanan Cikal Pet Care Polman, Anda menyetujui untuk terikat dengan 
              Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Layanan</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Cikal Pet Care menyediakan layanan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Grooming (mandi, potong kuku, styling) untuk kucing dan anjing</li>
              <li>Konsultasi kesehatan dan vaksinasi</li>
              <li>Pet hotel (penitipan hewan)</li>
              <li>Penjualan produk perawatan hewan (makanan, aksesoris, obat-obatan)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Booking dan Pembatalan</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">3.1 Booking</h3>
                <p className="leading-relaxed">
                  Booking dapat dilakukan melalui website, WhatsApp, atau langsung datang ke toko. 
                  Booking akan dikonfirmasi setelah kami menerima informasi lengkap tentang hewan peliharaan Anda.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">3.2 Pembatalan</h3>
                <p className="leading-relaxed">
                  Untuk layanan grooming/konsultasi: Pembatalan dapat dilakukan maksimal 3 jam sebelum jadwal tanpa biaya.
                  Pembatalan kurang dari 3 jam akan dikenakan biaya pembatalan 25% dari total layanan.
                </p>
                <p className="leading-relaxed mt-2">
                  Untuk pet hotel: Pembatalan 24 jam sebelum check-in, DP dapat dikembalikan 100%. 
                  Pembatalan kurang dari 24 jam, DP hangus.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Pembayaran</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                <strong>4.1 Harga:</strong> Harga layanan dan produk tercantum di website dapat berubah sewaktu-waktu. 
                Harga yang berlaku adalah harga saat booking dikonfirmasi.
              </p>
              <p className="leading-relaxed">
                <strong>4.2 Metode Pembayaran:</strong> Kami menerima pembayaran tunai, transfer bank, dan QRIS. 
                Untuk pembelian online, pembayaran harus dilakukan maksimal 24 jam setelah checkout.
              </p>
              <p className="leading-relaxed">
                <strong>4.3 Down Payment (DP):</strong> Untuk layanan pet hotel dan booking khusus, diperlukan DP 30% 
                yang tidak dapat dikembalikan jika terjadi pembatalan kurang dari 24 jam.
              </p>
              <p className="leading-relaxed">
                <strong>4.4 Refund:</strong> Refund hanya diberikan untuk produk cacat/rusak atau kesalahan dari pihak kami. 
                Proses refund memakan waktu 3-7 hari kerja.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Tanggung Jawab Pelanggan</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Sebagai pemilik hewan, Anda bertanggung jawab untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Memberikan informasi akurat tentang kondisi kesehatan dan perilaku hewan</li>
              <li>Memastikan hewan sudah divaksinasi (terutama untuk pet hotel)</li>
              <li>Membawa buku vaksinasi atau rekam medis jika diminta</li>
              <li>Memberitahu staf jika hewan memiliki alergi atau kondisi khusus</li>
              <li>Menjemput hewan sesuai jadwal yang telah ditentukan</li>
              <li>Membayar biaya tambahan jika ada layanan ekstra yang diminta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Batasan Tanggung Jawab</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                <strong>6.1 Kondisi Hewan:</strong> Kami tidak bertanggung jawab atas kondisi kesehatan hewan yang sudah 
                ada sebelumnya kecuali disebabkan oleh kelalaian langsung dari staf kami.
              </p>
              <p className="leading-relaxed">
                <strong>6.2 Risiko Grooming:</strong> Grooming memiliki risiko minimal seperti stres, lecet minor, 
                atau luka kecil terutama untuk hewan yang gelisah. Kami akan melakukan yang terbaik untuk meminimalkan risiko.
              </p>
              <p className="leading-relaxed">
                <strong>6.3 Barang Pribadi:</strong> Kami tidak bertanggung jawab atas kehilangan atau kerusakan 
                barang pribadi yang dibawa saat penitipan.
              </p>
              <p className="leading-relaxed">
                <strong>6.4 Force Majeure:</strong> Kami tidak bertanggung jawab atas keterlambatan atau kegagalan 
                layanan akibat bencana alam, pandemi, atau kejadian di luar kendali kami.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Produk</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                <strong>7.1 Keaslian:</strong> Semua produk yang dijual adalah 100% original dari distributor resmi.
              </p>
              <p className="leading-relaxed">
                <strong>7.2 Expired Date:</strong> Kami menjamin produk yang dijual memiliki masa expired minimal 6 bulan 
                (kecuali disebutkan khusus untuk produk promo).
              </p>
              <p className="leading-relaxed">
                <strong>7.3 Retur:</strong> Retur produk dapat dilakukan dalam 1x24 jam jika produk cacat/rusak dengan 
                menyertakan foto/video sebagai bukti. Produk harus dalam kondisi lengkap dan belum digunakan.
              </p>
              <p className="leading-relaxed">
                <strong>7.4 Pengiriman:</strong> Risiko kerusakan selama pengiriman ditanggung oleh pihak ekspedisi. 
                Kami sarankan untuk asuransi pengiriman untuk produk bernilai tinggi.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Privasi dan Data</h2>
            <p className="text-gray-600 leading-relaxed">
              Penggunaan data pribadi Anda diatur dalam Kebijakan Privasi kami. Dengan menggunakan layanan ini, 
              Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Hak Kekayaan Intelektual</h2>
            <p className="text-gray-600 leading-relaxed">
              Semua konten di website ini (logo, gambar, teks, desain) adalah milik Cikal Pet Care dan dilindungi 
              oleh hukum hak cipta. Dilarang menggunakan konten kami tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Perselisihan</h2>
            <p className="text-gray-600 leading-relaxed">
              Jika terjadi perselisihan, kami menganjurkan untuk menyelesaikannya secara musyawarah. 
              Jika tidak tercapai kesepakatan, perselisihan akan diselesaikan melalui jalur hukum yang berlaku 
              di wilayah Polewali Mandar, Sulawesi Barat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Perubahan Syarat & Ketentuan</h2>
            <p className="text-gray-600 leading-relaxed">
              Kami berhak mengubah Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui 
              website atau email. Penggunaan layanan setelah perubahan berarti Anda menerima syarat yang baru.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Kontak</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi:
            </p>
            <div className="bg-purple-50 rounded-xl p-6 space-y-2">
              <p className="font-bold text-gray-800">Cikal Pet Care Polman</p>
              <p className="text-gray-600">Email: info@cikalpetcare.com</p>
              <p className="text-gray-600">WhatsApp: +62 812-3456-7890</p>
              <p className="text-gray-600">Alamat: Jl. Jend. Sudirman, Polewali, Sulawesi Barat</p>
            </div>
          </section>

          <section className="border-t-2 border-gray-200 pt-6">
            <p className="text-sm text-gray-500 leading-relaxed">
              Dengan menggunakan layanan Cikal Pet Care Polman, Anda mengakui bahwa Anda telah membaca, memahami, 
              dan menyetujui untuk terikat dengan Syarat dan Ketentuan ini.
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Baca juga:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/privacy"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg"
            >
              Kebijakan Privasi
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
