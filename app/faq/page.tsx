import { Metadata } from 'next'
import { HelpCircle, ChevronDown } from 'lucide-react'

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
      {
        q: 'Apakah ada layanan home service/panggilan ke rumah?',
        a: 'Ya, kami menyediakan layanan home service untuk area Polewali dan sekitarnya. Biaya tambahan untuk layanan home service akan disesuaikan dengan jarak lokasi.'
      }
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
      {
        q: 'Bagaimana cara membayar untuk pembelian online?',
        a: 'Setelah checkout, Anda akan menerima detail pesanan dan nomor rekening. Lakukan pembayaran sesuai total yang tertera, lalu upload bukti transfer di halaman pembayaran.'
      }
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
      {
        q: 'Bagaimana cara retur produk jika ada cacat/rusak?',
        a: 'Jika produk cacat/rusak, segera hubungi kami maksimal 1x24 jam setelah barang diterima dengan menyertakan foto/video. Kami akan bantu proses penukaran atau refund.'
      },
      {
        q: 'Apakah bisa request produk yang tidak ada di katalog?',
        a: 'Tentu! Hubungi kami via WhatsApp untuk request produk tertentu. Kami akan carikan dengan harga terbaik dari distributor resmi.'
      }
    ]
  },
  {
    category: 'Perawatan Hewan',
    questions: [
      {
        q: 'Seberapa sering hewan peliharaan harus dimandikan?',
        a: 'Untuk anjing: 2-4 minggu sekali tergantung aktivitas dan kondisi bulu. Untuk kucing: 1-2 bulan sekali karena kucing bisa membersihkan diri sendiri. Untuk hewan berbulu panjang disarankan lebih sering.'
      },
      {
        q: 'Apakah aman untuk memandikan anak anjing/kucing?',
        a: 'Aman, asalkan sudah berusia minimal 8 minggu dan sudah mendapat vaksinasi pertama. Untuk anak hewan yang lebih muda, sebaiknya konsultasi dulu dengan dokter hewan.'
      },
      {
        q: 'Bagaimana cara merawat hewan setelah grooming?',
        a: 'Hindari aktivitas berat selama 2-3 jam setelah grooming. Jaga area telinga tetap kering. Jika ada kulit kemerahan atau iritasi, segera hubungi kami atau dokter hewan.'
      },
      {
        q: 'Apakah ada tips mencegah hewan stress saat grooming?',
        a: 'Biasakan hewan dengan sentuhan sejak dini. Bawa mainan/selimut favorit saat grooming. Pilih salon yang ramah hewan seperti kami yang menggunakan pendekatan gentle dan sabar.'
      }
    ]
  },
  {
    category: 'Pet Hotel',
    questions: [
      {
        q: 'Berapa lama minimal menginap di pet hotel?',
        a: 'Minimal menginap adalah 1 malam/1 hari. Untuk penitipan harian (tanpa menginap) juga tersedia dengan hitungan per 12 jam.'
      },
      {
        q: 'Apa yang perlu dibawa saat menitipkan hewan?',
        a: 'Bawa makanan hewan (jika punya preferensi khusus), kandang/box (opsional), buku vaksinasi, dan kontak darurat pemilik. Kami menyediakan tempat makan/minum dan tempat tidur.'
      },
      {
        q: 'Apakah bisa memantau hewan selama dititipkan?',
        a: 'Ya! Kami akan mengirimkan foto/video update hewan Anda melalui WhatsApp setiap hari. Anda juga bisa video call untuk melihat kondisi hewan.'
      },
      {
        q: 'Bagaimana jika hewan sakit saat dititipkan?',
        a: 'Kami akan segera menghubungi Anda dan membawa ke dokter hewan jika diperlukan. Biaya pengobatan akan dikonfirmasi terlebih dahulu kepada pemilik.'
      }
    ]
  },
  {
    category: 'Umum',
    questions: [
      {
        q: 'Di mana lokasi Cikal Pet Care?',
        a: 'Kami berlokasi di Jl. Jend. Sudirman, Polewali, Sulawesi Barat. Cek halaman Kontak untuk alamat lengkap dan peta lokasi.'
      },
      {
        q: 'Jam operasional Cikal Pet Care?',
        a: 'Kami buka Senin - Sabtu pukul 09:00 - 17:00 WIB. Minggu dan hari libur nasional tutup (kecuali ada booking sebelumnya).'
      },
      {
        q: 'Apakah melayani semua jenis hewan?',
        a: 'Kami fokus melayani kucing dan anjing. Untuk hewan eksotis (kelinci, hamster, burung, dll), silakan konsultasi dulu untuk ketersediaan layanan.'
      },
      {
        q: 'Bagaimana cara menghubungi Cikal Pet Care?',
        a: 'Anda bisa hubungi kami via WhatsApp, telepon, atau datang langsung ke toko. Semua kontak tersedia di halaman Kontak.'
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4 sm:mb-6 shadow-xl">
            <HelpCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            Pertanyaan yang Sering Diajukan
          </p>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base px-4 break-words">
            Temukan jawaban untuk pertanyaan umum seputar layanan kami
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              {/* Category Title */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-3 sm:space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <details
                    key={qIdx}
                    className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 sm:p-5 lg:p-6 cursor-pointer list-none">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 pr-3 sm:pr-4 break-words">
                        {faq.q}
                      </h3>
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-orange-500 flex-shrink-0 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
                      <p className="text-gray-600 leading-relaxed border-t-2 border-gray-100 pt-3 sm:pt-4 text-sm sm:text-base break-words">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl text-center text-white shadow-2xl animate-float">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-4">Masih Ada Pertanyaan?</h2>
          <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90 px-4 break-words">
            Tim kami siap membantu menjawab pertanyaan Anda
          </p>
          <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-center flex-wrap px-4">
            <a
              href="/kontak"
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base bg-white text-orange-600 rounded-lg sm:rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
            >
              Hubungi Kami
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base bg-blue-500 text-white rounded-lg sm:rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
