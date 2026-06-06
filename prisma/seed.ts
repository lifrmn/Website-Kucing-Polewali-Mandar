import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - be careful in production!)
  console.log('🗑️  Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.penitipanBooking.deleteMany()
  await prisma.penitipanPackage.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.product.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  // Seed Admin User
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cikalpetcare.com',
      name: 'Admin Cikal Pet Care',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // Seed Products
  console.log('📦 Seeding products...')
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Royal Canin Persian 2kg',
        slug: 'royal-canin-persian-2kg',
        description: 'Makanan khusus untuk kucing Persia. Diformulasikan dengan nutrisi seimbang untuk kesehatan bulu dan pencernaan.',
        sku: 'RC-PRS-2KG',
        price: 285000,
        stock: 15,
        category: 'Makanan',
        image_url: '/placeholder-product.jpg',
        is_active: true,
        featured: true,
      },
      {
        name: 'Royal Canin Kitten 2kg',
        slug: 'royal-canin-kitten-2kg',
        description: 'Makanan untuk anak kucing 4-12 bulan. Mendukung pertumbuhan optimal dan sistem kekebalan tubuh.',
        sku: 'RC-KIT-2KG',
        price: 295000,
        stock: 20,
        category: 'Makanan',
        image_url: '/placeholder-product.jpg',
        is_active: true,
        featured: true,
      },
      {
        name: 'Whiskas Adult 480g',
        slug: 'whiskas-adult-480g',
        description: 'Makanan kucing dewasa rasa ikan laut. Mengandung omega 3 & 6 untuk bulu sehat.',
        sku: 'WHS-ADL-480',
        price: 18000,
        stock: 50,
        category: 'Makanan',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Cat Litter Gumpal 10L',
        slug: 'cat-litter-gumpal-10l',
        description: 'Pasir kucing premium yang mudah menggumpal. Bebas debu dan aroma wangi natural.',
        sku: 'CL-GMP-10L',
        price: 65000,
        stock: 30,
        category: 'Pasir',
        image_url: '/placeholder-product.jpg',
        is_active: true,
        featured: true,
      },
      {
        name: 'Catsan Ultra Clumping 5L',
        slug: 'catsan-ultra-clumping-5l',
        description: 'Pasir kucing clumping ultra dengan kontrol bau maksimal. Sangat ekonomis.',
        sku: 'CS-UC-5L',
        price: 95000,
        stock: 25,
        category: 'Pasir',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Sisir Grooming Professional',
        slug: 'sisir-grooming-professional',
        description: 'Sisir khusus untuk grooming kucing. Stainless steel, anti karat, ergonomis.',
        sku: 'GRM-SSR-01',
        price: 45000,
        stock: 40,
        category: 'Grooming',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Shampoo Kucing Anti Kutu 200ml',
        slug: 'shampoo-kucing-anti-kutu-200ml',
        description: 'Shampoo khusus kucing dengan formula anti kutu dan jamur. pH balanced.',
        sku: 'SHP-AK-200',
        price: 55000,
        stock: 35,
        category: 'Grooming',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Mainan Bola Interaktif',
        slug: 'mainan-bola-interaktif',
        description: 'Mainan bola otomatis untuk kucing. Sensor gerak, USB rechargeable.',
        sku: 'TOY-BL-01',
        price: 125000,
        stock: 15,
        category: 'Mainan',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Kandang Kucing Medium',
        slug: 'kandang-kucing-medium',
        description: 'Kandang kucing ukuran medium 60x45x50cm. Bahan besi kokoh dengan pintu geser.',
        sku: 'KDG-MD-01',
        price: 350000,
        stock: 8,
        category: 'Kandang',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
      {
        name: 'Pet Carrier Travel Box',
        slug: 'pet-carrier-travel-box',
        description: 'Pet carrier untuk travel. Bahan plastik kuat, ventilasi baik, pegangan nyaman.',
        sku: 'PTC-TB-01',
        price: 150000,
        stock: 20,
        category: 'Aksesoris',
        image_url: '/placeholder-product.jpg',
        is_active: true,
      },
    ],
  })
  console.log(`✅ ${products.count} products created`)

  // Seed Services
  console.log('💆 Seeding services...')
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Grooming Basic',
        slug: 'grooming-basic',
        description: 'Paket grooming dasar meliputi: mandi dengan shampoo premium, blow dry, sisir, potong kuku, dan pembersihan telinga.',
        type: 'grooming',
        duration: 60,
        price: 50000,
        is_active: true,
      },
      {
        name: 'Grooming Premium',
        slug: 'grooming-premium',
        description: 'Paket premium meliputi: semua layanan basic + styling bulu, parfum khusus kucing, dan nail polish (opsional).',
        type: 'grooming',
        duration: 90,
        price: 85000,
        is_active: true,
      },
      {
        name: 'Konsultasi Kesehatan',
        slug: 'konsultasi-kesehatan',
        description: 'Konsultasi dengan dokter hewan berpengalaman. Termasuk pemeriksaan fisik dasar dan rekomendasi perawatan.',
        type: 'konsultasi',
        duration: 30,
        price: 75000,
        is_active: true,
      },
      {
        name: 'Vaksinasi Lengkap',
        slug: 'vaksinasi-lengkap',
        description: 'Paket vaksinasi lengkap (Tricat/Tetracat + Rabies). Termasuk pemeriksaan kesehatan pra-vaksin.',
        type: 'vaksinasi',
        duration: 30,
        price: 250000,
        is_active: true,
      },
      {
        name: 'Pemeriksaan Lengkap',
        slug: 'pemeriksaan-lengkap',
        description: 'Check-up lengkap meliputi: pemeriksaan fisik menyeluruh, cek vital signs, konsultasi, dan rekomendasi.',
        type: 'pemeriksaan',
        duration: 45,
        price: 100000,
        is_active: true,
      },
      {
        name: 'Sterilisasi Kucing Betina',
        slug: 'sterilisasi-kucing-betina',
        description: 'Operasi sterilisasi untuk kucing betina. Termasuk pemeriksaan pra-operasi, operasi, dan obat pasca operasi.',
        type: 'sterilisasi',
        duration: 180,
        price: 500000,
        is_active: true,
      },
      {
        name: 'Sterilisasi Kucing Jantan',
        slug: 'sterilisasi-kucing-jantan',
        description: 'Operasi kastrasi untuk kucing jantan. Termasuk pemeriksaan pra-operasi, operasi, dan obat pasca operasi.',
        type: 'sterilisasi',
        duration: 120,
        price: 350000,
        is_active: true,
      },
    ],
  })
  console.log(`✅ ${services.count} services created`)

  // Seed Penitipan Packages
  console.log('🏠 Seeding penitipan packages...')
  const penitipanPackages = await prisma.penitipanPackage.createMany({
    data: [
      {
        name: 'Standard Room',
        slug: 'standard-room',
        description: 'Kamar nyaman dengan AC, kandang bersih, dan tempat bermain. Cocok untuk kucing dewasa.',
        price_per_night: 50000,
        features: 'AC, Kandang Individual, Makanan 2x sehari, Air minum unlimited, Bermain 1x sehari',
        max_cats: 1,
        is_active: true,
      },
      {
        name: 'Deluxe Room',
        slug: 'deluxe-room',
        description: 'Kamar premium dengan lebih banyak ruang gerak dan fasilitas tambahan.',
        price_per_night: 75000,
        features: 'AC, Kandang Premium, Makanan Premium 3x sehari, Snack, Bermain 2x sehari, Grooming basic 1x seminggu',
        max_cats: 1,
        is_active: true,
      },
      {
        name: 'VIP Suite',
        slug: 'vip-suite',
        description: 'Suite mewah dengan perawatan ekstra dan monitoring 24/7.',
        price_per_night: 100000,
        features: 'AC, Suite Besar, Makanan Premium 3x sehari, Snack unlimited, Bermain 3x sehari, Grooming 2x seminggu, CCTV 24/7',
        max_cats: 1,
        is_active: true,
      },
      {
        name: 'Family Room',
        slug: 'family-room',
        description: 'Kamar besar untuk 2-3 kucing dari keluarga yang sama.',
        price_per_night: 120000,
        features: 'AC, Kandang Keluarga, Makanan 2x sehari untuk semua, Bermain bersama 2x sehari',
        max_cats: 3,
        is_active: true,
      },
    ],
  })
  console.log(`✅ ${penitipanPackages.count} penitipan packages created`)

  // Seed Blog Posts
  console.log('📝 Seeding blog posts...')
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        title: '5 Tips Merawat Kucing Persia',
        slug: '5-tips-merawat-kucing-persia',
        content: `# 5 Tips Merawat Kucing Persia

Kucing Persia adalah salah satu ras kucing paling populer di Indonesia karena bulunya yang indah dan karakternya yang tenang. Namun, kucing Persia membutuhkan perawatan khusus agar tetap sehat dan bahagia.

## 1. Sisir Bulu Setiap Hari

Bulu Persia yang panjang dan lebat mudah kusut dan berbelit. Sisir bulu kucing Persia Anda minimal 1x sehari menggunakan sisir khusus kucing berbulu panjang.

## 2. Mandi Rutin

Mandikan kucing Persia 2-4 minggu sekali dengan shampoo khusus kucing. Keringkan dengan hairdryer agar tidak pilek.

## 3. Bersihkan Mata dan Telinga

Kucing Persia cenderung memiliki mata berair. Bersihkan mata setiap hari dengan kapas lembab hangat. Bersihkan telinga 1x seminggu.

## 4. Makanan Berkualitas

Berikan makanan premium khusus kucing Persia yang mengandung nutrisi untuk kesehatan bulu dan pencernaan.

## 5. Grooming Profesional

Bawa kucing Persia Anda ke grooming profesional minimal 1-2 bulan sekali untuk perawatan maksimal.

---

*Butuh bantuan merawat kucing Persia Anda? Hubungi Cikal Pet Care Polman sekarang!*`,
        excerpt: 'Kucing Persia membutuhkan perawatan khusus. Pelajari 5 tips penting merawat kucing Persia agar tetap sehat dan bahagia.',
        featured_image: '/placeholder-product.jpg',
        category: 'Tips Perawatan',
        tags: 'kucing persia, perawatan, grooming',
        author: 'Cikal Pet Care',
        is_published: true,
        published_at: new Date(),
      },
      {
        title: 'Pentingnya Vaksinasi untuk Kucing',
        slug: 'pentingnya-vaksinasi-untuk-kucing',
        content: `# Pentingnya Vaksinasi untuk Kucing

Vaksinasi adalah salah satu cara terbaik melindungi kucing Anda dari berbagai penyakit berbahaya dan mematikan.

## Mengapa Vaksinasi Penting?

Vaksinasi membantu sistem kekebalan tubuh kucing mengenali dan melawan penyakit. Bahkan kucing yang hanya tinggal di dalam rumah tetap membutuhkan vaksinasi.

## Jenis-jenis Vaksin Kucing

### Vaksin Core (Wajib)
- **Tricat/Tetracat**: Melindungi dari Panleukopenia, Calicivirus, dan Rhinotracheitis
- **Rabies**: Melindungi dari virus rabies

### Vaksin Non-Core (Opsional)
- **FeLV**: Untuk kucing yang sering keluar rumah
- **Chlamydia**: Untuk kucing yang berinteraksi dengan banyak kucing lain

## Jadwal Vaksinasi

- **Kitten (8-12 minggu)**: Vaksin pertama
- **Kitten (12-16 minggu)**: Vaksin kedua (booster)
- **Dewasa**: Booster setiap 1-3 tahun

## Efek Samping Vaksinasi

Efek samping yang umum dan normal:
- Sedikit lesu 1-2 hari
- Nafsu makan menurun sementara
- Bengkak kecil di area suntikan

---

*Hubungi Cikal Pet Care Polman untuk jadwal vaksinasi kucing Anda!*`,
        excerpt: 'Pelajari mengapa vaksinasi sangat penting untuk kesehatan kucing Anda dan kapan jadwal vaksinasi yang tepat.',
        featured_image: '/placeholder-product.jpg',
        category: 'Kesehatan',
        tags: 'vaksinasi, kesehatan, pencegahan penyakit',
        author: 'Cikal Pet Care',
        is_published: true,
        published_at: new Date(),
      },
      {
        title: 'Cara Memilih Makanan Kucing yang Tepat',
        slug: 'cara-memilih-makanan-kucing-yang-tepat',
        content: `# Cara Memilih Makanan Kucing yang Tepat

Memilih makanan yang tepat sangat penting untuk kesehatan dan kebahagiaan kucing Anda. Berikut panduan lengkapnya.

## Pertimbangan Utama

### 1. Usia Kucing
- **Kitten (0-12 bulan)**: Butuh protein tinggi untuk pertumbuhan
- **Adult (1-7 tahun)**: Nutrisi seimbang untuk maintenance
- **Senior (7+ tahun)**: Rendah kalori, mudah dicerna

### 2. Kondisi Kesehatan
- **Kucing steril**: Pilih formula sterilized/weight control
- **Kucing sensitif**: Formula hypoallergenic atau sensitive
- **Kucing sakit**: Konsultasi dokter hewan

### 3. Tipe Makanan

**Dry Food (Kibble)**
- ✅ Ekonomis, tahan lama
- ✅ Membantu membersihkan gigi
- ❌ Kandungan air rendah

**Wet Food (Kaleng)**
- ✅ Kandungan air tinggi (bagus untuk ginjal)
- ✅ Lebih disukai kucing
- ❌ Lebih mahal, cepat basi

**Kombinasi**
- Ideal: 70% dry + 30% wet

## Bahan yang Harus Ada

- Protein hewani (ayam, ikan) sebagai bahan utama
- Taurine (essential amino acid untuk kucing)
- Omega 3 & 6 untuk bulu sehat
- Vitamin dan mineral lengkap

## Bahan yang Harus Dihindari

- By-product yang tidak jelas
- Pewarna dan perasa buatan berlebihan
- Gula dan garam tinggi

---

*Temukan makanan kucing berkualitas di Cikal Pet Care Polman!*`,
        excerpt: 'Panduan lengkap memilih makanan kucing berdasarkan usia, kondisi kesehatan, dan kebutuhan nutrisi.',
        featured_image: '/placeholder-product.jpg',
        category: 'Nutrisi',
        tags: 'makanan kucing, nutrisi, kesehatan',
        author: 'Cikal Pet Care',
        is_published: true,
        published_at: new Date(),
      },
    ],
  })
  console.log(`✅ ${blogPosts.count} blog posts created`)

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
