import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { isStrongAdminPassword } from '../src/lib/validations/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database seed tidak boleh dijalankan dengan NODE_ENV=production')
  }

  if (process.env.SEED_RESET_DATABASE !== 'true') {
    throw new Error('Set SEED_RESET_DATABASE=true untuk mengizinkan reset database development')
  }

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword || !isStrongAdminPassword(adminPassword)) {
    throw new Error('INITIAL_ADMIN_EMAIL wajib diisi dan INITIAL_ADMIN_PASSWORD harus 12-256 karakter dengan huruf besar, huruf kecil, angka, dan simbol')
  }

  console.log('🗑️  Clearing existing data...')
  await prisma.activityLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.serviceBooking.deleteMany()
  await prisma.penitipanBooking.deleteMany()
  await prisma.bookingCapacity.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.penitipanPackage.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.product.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  // Seed Admin User
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin Cikal Pet Care',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Sisir Grooming Professional',
        slug: 'sisir-grooming-professional',
        description: 'Sisir grooming universal untuk kucing dan anjing. Stainless steel, anti karat, dan ergonomis.',
        sku: 'GRM-SSR-01',
        price: 45000,
        stock: 40,
        category: 'Grooming',
        pet_types: '["CAT","DOG"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT"]',
        image_url: '/placeholder-product.svg',
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
        pet_types: '["CAT","DOG","RABBIT"]',
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Dog Food Adult Chicken 2kg',
        slug: 'dog-food-adult-chicken-2kg',
        description: 'Makanan kering untuk anjing dewasa dengan protein ayam dan nutrisi harian seimbang.',
        sku: 'DOG-FD-2KG', price: 175000, stock: 18, category: 'Makanan',
        pet_types: '["DOG"]', image_url: '/placeholder-product.svg', is_active: true, featured: true,
      },
      {
        name: 'Shampoo Anjing Gentle Care 250ml',
        slug: 'shampoo-anjing-gentle-care-250ml',
        description: 'Shampoo khusus anjing untuk membantu membersihkan bulu dan menjaga kelembutannya.',
        sku: 'DOG-SHP-250', price: 65000, stock: 24, category: 'Grooming',
        pet_types: '["DOG"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Dental Chew Anjing',
        slug: 'dental-chew-anjing',
        description: 'Camilan kunyah untuk anjing yang membantu perawatan gigi sebagai bagian dari rutinitas harian.',
        sku: 'DOG-DCH-01', price: 42000, stock: 32, category: 'Makanan',
        pet_types: '["DOG"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Mainan Tali Anjing',
        slug: 'mainan-tali-anjing',
        description: 'Mainan tali kuat untuk aktivitas tarik dan bermain bersama anjing dengan pengawasan pemilik.',
        sku: 'DOG-TOY-01', price: 48000, stock: 20, category: 'Mainan',
        pet_types: '["DOG"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Mangkuk Makan Stainless',
        slug: 'mangkuk-makan-stainless',
        description: 'Mangkuk makan stainless yang mudah dibersihkan untuk kucing, anjing, dan kelinci.',
        sku: 'PET-BWL-01', price: 38000, stock: 30, category: 'Aksesoris',
        pet_types: '["CAT","DOG","RABBIT"]', image_url: '/placeholder-product.svg', is_active: true, featured: true,
      },
      {
        name: 'Hay Kelinci Timothy 500g',
        slug: 'hay-kelinci-timothy-500g',
        description: 'Timothy hay untuk membantu memenuhi kebutuhan serat harian kelinci dewasa.',
        sku: 'RBT-HAY-500', price: 75000, stock: 16, category: 'Makanan',
        pet_types: '["RABBIT"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Bedding Hewan Kecil',
        slug: 'bedding-hewan-kecil',
        description: 'Alas kandang lembut dan menyerap untuk hamster dan hewan kecil lainnya.',
        sku: 'SML-BED-01', price: 35000, stock: 25, category: 'Kandang',
        pet_types: '["HAMSTER"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Pakan Burung Harian 500g',
        slug: 'pakan-burung-harian-500g',
        description: 'Campuran biji untuk kebutuhan pakan harian burung peliharaan sesuai petunjuk kemasan.',
        sku: 'BRD-FD-500', price: 32000, stock: 22, category: 'Makanan',
        pet_types: '["BIRD"]', image_url: '/placeholder-product.svg', is_active: true,
      },
      {
        name: 'Pembersih Habitat Multi-Pet 500ml',
        slug: 'pembersih-habitat-multi-pet-500ml',
        description: 'Pembersih habitat untuk area tinggal reptil dan hewan peliharaan lain. Gunakan sesuai petunjuk kemasan.',
        sku: 'OTH-CLN-500', price: 58000, stock: 15, category: 'Grooming',
        pet_types: '["OTHER"]', image_url: '/placeholder-product.svg', is_active: true,
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
        supported_pet_types: '["CAT","DOG","RABBIT"]',
        duration: 60,
        price: 50000,
        is_active: true,
      },
      {
        name: 'Grooming Premium',
        slug: 'grooming-premium',
        description: 'Paket premium meliputi: semua layanan basic + styling bulu, parfum khusus kucing, dan nail polish (opsional).',
        type: 'grooming',
        supported_pet_types: '["CAT"]',
        duration: 90,
        price: 85000,
        is_active: true,
      },
      {
        name: 'Konsultasi Kesehatan',
        slug: 'konsultasi-kesehatan',
        description: 'Konsultasi dengan dokter hewan berpengalaman. Termasuk pemeriksaan fisik dasar dan rekomendasi perawatan.',
        type: 'konsultasi',
        supported_pet_types: '["CAT","DOG","RABBIT","HAMSTER","BIRD","OTHER"]',
        duration: 30,
        price: 75000,
        is_active: true,
      },
      {
        name: 'Vaksinasi Lengkap',
        slug: 'vaksinasi-lengkap',
        description: 'Paket vaksinasi lengkap (Tricat/Tetracat + Rabies). Termasuk pemeriksaan kesehatan pra-vaksin.',
        type: 'vaksinasi',
        supported_pet_types: '["CAT"]',
        duration: 30,
        price: 250000,
        is_active: true,
      },
      {
        name: 'Pemeriksaan Lengkap',
        slug: 'pemeriksaan-lengkap',
        description: 'Check-up lengkap meliputi: pemeriksaan fisik menyeluruh, cek vital signs, konsultasi, dan rekomendasi.',
        type: 'pemeriksaan',
        supported_pet_types: '["CAT","DOG","RABBIT","HAMSTER","BIRD","OTHER"]',
        duration: 45,
        price: 100000,
        is_active: true,
      },
      {
        name: 'Sterilisasi Kucing Betina',
        slug: 'sterilisasi-kucing-betina',
        description: 'Operasi sterilisasi untuk kucing betina. Termasuk pemeriksaan pra-operasi, operasi, dan obat pasca operasi.',
        type: 'sterilisasi',
        supported_pet_types: '["CAT"]',
        duration: 180,
        price: 500000,
        is_active: true,
      },
      {
        name: 'Sterilisasi Kucing Jantan',
        slug: 'sterilisasi-kucing-jantan',
        description: 'Operasi kastrasi untuk kucing jantan. Termasuk pemeriksaan pra-operasi, operasi, dan obat pasca operasi.',
        type: 'sterilisasi',
        supported_pet_types: '["CAT"]',
        duration: 120,
        price: 350000,
        is_active: true,
      },
      {
        name: 'Grooming Anjing Premium',
        slug: 'grooming-anjing-premium',
        description: 'Perawatan lengkap anjing meliputi mandi, pengeringan, penyisiran, pembersihan telinga, dan potong kuku.',
        type: 'grooming',
        supported_pet_types: '["DOG"]',
        duration: 90,
        price: 110000,
        image_url: '/placeholder-product.svg',
        is_active: true,
        featured: true,
      },
      {
        name: 'Perawatan Kelinci dan Hewan Kecil',
        slug: 'perawatan-kelinci-hewan-kecil',
        description: 'Perawatan kebersihan ringan, penyisiran, pemeriksaan kuku, serta konsultasi habitat untuk kelinci dan hewan kecil.',
        type: 'grooming',
        supported_pet_types: '["RABBIT","HAMSTER"]',
        duration: 45,
        price: 70000,
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Perawatan Burung',
        slug: 'perawatan-burung',
        description: 'Pemeriksaan kebersihan bulu, kuku, paruh, serta konsultasi perawatan harian burung peliharaan.',
        type: 'pemeriksaan',
        supported_pet_types: '["BIRD"]',
        duration: 40,
        price: 75000,
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Konsultasi Hewan Eksotis',
        slug: 'konsultasi-hewan-eksotis',
        description: 'Konsultasi awal kebutuhan perawatan untuk reptil dan jenis hewan lain sebelum menentukan penanganan lanjutan.',
        type: 'konsultasi',
        supported_pet_types: '["OTHER"]',
        duration: 45,
        price: 100000,
        image_url: '/placeholder-product.svg',
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
        max_pets: 1,
        accepted_pet_types: '["CAT"]',
        is_active: true,
      },
      {
        name: 'Deluxe Room',
        slug: 'deluxe-room',
        description: 'Kamar premium dengan lebih banyak ruang gerak dan fasilitas tambahan.',
        price_per_night: 75000,
        features: 'AC, Kandang Premium, Makanan Premium 3x sehari, Snack, Bermain 2x sehari, Grooming basic 1x seminggu',
        max_pets: 1,
        accepted_pet_types: '["CAT"]',
        is_active: true,
      },
      {
        name: 'VIP Suite',
        slug: 'vip-suite',
        description: 'Suite mewah dengan perawatan ekstra dan monitoring 24/7.',
        price_per_night: 100000,
        features: 'AC, Suite Besar, Makanan Premium 3x sehari, Snack unlimited, Bermain 3x sehari, Grooming 2x seminggu, CCTV 24/7',
        max_pets: 1,
        accepted_pet_types: '["CAT"]',
        is_active: true,
      },
      {
        name: 'Family Room',
        slug: 'family-room',
        description: 'Kamar besar untuk 2-3 kucing dari keluarga yang sama.',
        price_per_night: 120000,
        features: 'AC, Kandang Keluarga, Makanan 2x sehari untuk semua, Bermain bersama 2x sehari',
        max_pets: 3,
        accepted_pet_types: '["CAT"]',
        is_active: true,
      },
      {
        name: 'Dog Comfort Room',
        slug: 'dog-comfort-room',
        description: 'Ruang penitipan anjing dengan area istirahat dan aktivitas harian terjadwal.',
        price_per_night: 90000,
        features: 'Area individual, Air minum, Makan sesuai jadwal pemilik, Aktivitas 2x sehari, Pemantauan harian',
        max_pets: 1,
        accepted_pet_types: '["DOG"]',
        image_url: '/placeholder-product.svg',
        is_active: true,
        featured: true,
      },
      {
        name: 'Small Pet Habitat',
        slug: 'small-pet-habitat',
        description: 'Habitat tenang untuk kelinci, hamster, dan hewan kecil dengan alas serta rutinitas pakan terpisah.',
        price_per_night: 65000,
        features: 'Habitat individual, Bedding bersih, Pakan sesuai instruksi, Air minum, Pemantauan harian',
        max_pets: 2,
        accepted_pet_types: '["RABBIT","HAMSTER"]',
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Bird Care Stay',
        slug: 'bird-care-stay',
        description: 'Area penitipan burung yang tenang dengan jadwal pakan dan kebersihan kandang.',
        price_per_night: 60000,
        features: 'Area tenang, Pakan sesuai instruksi, Air minum, Kebersihan kandang, Pemantauan harian',
        max_pets: 2,
        accepted_pet_types: '["BIRD"]',
        image_url: '/placeholder-product.svg',
        is_active: true,
      },
      {
        name: 'Custom Pet Care',
        slug: 'custom-pet-care',
        description: 'Penitipan untuk jenis hewan lain setelah kebutuhan habitat, pakan, dan penanganannya dikonsultasikan.',
        price_per_night: 100000,
        features: 'Konsultasi pra-booking, Habitat disesuaikan, Pakan sesuai instruksi, Pemantauan harian',
        max_pets: 1,
        accepted_pet_types: '["OTHER"]',
        image_url: '/placeholder-product.svg',
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
        featured_image: '/placeholder-product.svg',
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
        featured_image: '/placeholder-product.svg',
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
        featured_image: '/placeholder-product.svg',
        category: 'Nutrisi',
        tags: 'makanan kucing, nutrisi, kesehatan',
        author: 'Cikal Pet Care',
        is_published: true,
        published_at: new Date(),
      },
      {
        title: 'Panduan Grooming Dasar untuk Anjing',
        slug: 'panduan-grooming-dasar-untuk-anjing',
        content: `# Panduan Grooming Dasar untuk Anjing

Grooming rutin membantu menjaga kebersihan kulit, bulu, telinga, dan kuku anjing. Frekuensinya perlu disesuaikan dengan jenis bulu, aktivitas, serta kondisi kesehatan masing-masing anjing.

## Rutinitas di Rumah

- Sisir bulu secara teratur dengan alat yang sesuai jenis bulu.
- Gunakan shampoo khusus anjing dan hindari produk manusia.
- Periksa telinga, sela kaki, dan kuku tanpa memaksa hewan.
- Keringkan bulu hingga tuntas setelah mandi.

## Kapan Membutuhkan Groomer?

Pertimbangkan bantuan groomer bila bulu kusut berat, anjing sulit ditangani saat potong kuku, atau membutuhkan perawatan sesuai karakter bulunya. Sampaikan riwayat alergi, kondisi kulit, dan perilaku anjing sebelum layanan dimulai.

Jika terdapat luka, kerontokan tidak wajar, bau menyengat, atau iritasi, konsultasikan lebih dahulu dengan dokter hewan.

---

*Lihat layanan grooming anjing yang tersedia di Cikal Pet Care Polman.*`,
        excerpt: 'Rutinitas grooming dasar untuk menjaga kebersihan bulu, telinga, kuku, dan kenyamanan anjing.',
        featured_image: '/placeholder-product.svg',
        category: 'Tips Perawatan',
        tags: 'anjing, grooming, perawatan bulu',
        author: 'Cikal Pet Care',
        is_published: true,
        published_at: new Date(),
      },
      {
        title: 'Kebutuhan Harian Kelinci yang Perlu Disiapkan',
        slug: 'kebutuhan-harian-kelinci-yang-perlu-disiapkan',
        content: `# Kebutuhan Harian Kelinci yang Perlu Disiapkan

Kelinci memerlukan lingkungan yang aman, ruang bergerak, pakan berserat, dan pemantauan kondisi tubuh setiap hari. Kebutuhannya berbeda dari kucing maupun anjing.

## Dasar Perawatan

- Sediakan hay berkualitas sebagai sumber serat utama untuk kelinci dewasa.
- Pastikan air minum bersih selalu tersedia.
- Berikan ruang aman untuk bergerak dan bersembunyi.
- Bersihkan area tinggal secara rutin dan jaga ventilasi.
- Amati nafsu makan serta jumlah kotoran setiap hari.

Perubahan makan, tidak adanya kotoran, lesu, atau kesulitan bernapas memerlukan perhatian dokter hewan sesegera mungkin. Jangan memberikan obat tanpa arahan profesional.

---

*Temukan kebutuhan dasar kelinci di katalog Cikal Pet Care Polman.*`,
        excerpt: 'Kenali kebutuhan pakan, air, ruang bergerak, kebersihan, dan pemantauan harian untuk kelinci.',
        featured_image: '/placeholder-product.svg',
        category: 'Tips Perawatan',
        tags: 'kelinci, hewan kecil, perawatan harian',
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
