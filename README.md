# 🐱 Cikal Pet Care Polman - Website Profesional

Website lengkap untuk Cikal Pet Care Polman - Konsultan Kesehatan Kucing & Pet Shop.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC)](https://tailwindcss.com/)

---

## ✨ Fitur Lengkap

### 🛍️ E-Commerce
- ✅ Katalog produk (makanan, pasir, mainan, dll)
- ✅ Shopping cart dengan Zustand
- ✅ Checkout & order management
- ✅ Payment verification system
- ✅ Order tracking

### 💆 Layanan Pet Care
- ✅ Grooming (basic & premium)
- ✅ Konsultasi kesehatan
- ✅ Vaksinasi
- ✅ Sterilisasi
- ✅ Penitipan kucing (boarding)

### 📝 Blog & Artikel
- ✅ Tips perawatan kucing
- ✅ Artikel kesehatan
- ✅ SEO-friendly
- ✅ Categories & tags

### 🔐 Admin Dashboard
- ✅ Products management (CRUD + image upload)
- ✅ Services management (CRUD)
- ✅ Blog management (CRUD + featured image)
- ✅ Orders & payment verification
- ✅ Statistics & analytics

### 📧 Email Notifications
- ✅ Order confirmation
- ✅ Payment confirmation
- ✅ Order status updates
- ✅ Beautiful HTML templates

### 🖼️ Image Upload
- ✅ Cloudinary integration
- ✅ Drag & drop
- ✅ Auto-optimization
- ✅ Preview & validation

---

## 🚀 Teknologi Stack

### Frontend
- **Framework**: Next.js 16.3.4 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **State**: Zustand 5.0.11
- **Icons**: React Icons 5.0.1
- **Notifications**: React Toastify 11.0.5

### Backend
- **Database**: Prisma ORM + SQLite pada persistent volume
- **Authentication**: NextAuth.js 5.0
- **Email**: Resend 6.9.2
- **Image Upload**: Cloudinary 2.9.0
- **Password**: bcryptjs 3.0.3

---

## 📋 Prerequisites

- Node.js 20.9+ (gunakan versi LTS aktif)
- npm atau yarn
- Git

---

## 🔧 Quick Start (15 Menit)

### 1. Clone & Install (2 menit)

```bash
# Clone repository
git clone https://github.com/yourusername/cikal-pet-care.git
cd cikal-pet-care

# Install dependencies
npm install
```

### 2. Setup Database (2 menit)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database dengan sample data
npm run db:seed
```

✅ Database siap dengan:
- 1 Admin user (admin@cikalpetcare.com / admin123)
- 10 Products (makanan, pasir, mainan)
- 7 Services (grooming, vaksinasi, konsultasi)
- 4 Penitipan packages
- 3 Blog posts

### 3. Setup Cloudinary (5 menit)

**Untuk upload gambar produk, blog, & bukti bayar**

1. Daftar GRATIS: https://cloudinary.com/users/register_free
2. Login → Dashboard → Settings → Access Keys
3. Copy credentials ke `.env`:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

📖 Panduan lengkap: [CLOUDINARY_SETUP_GUIDE.md](CLOUDINARY_SETUP_GUIDE.md)

### 4. Setup Resend (5 menit)

**Untuk email notifications**

1. Daftar GRATIS: https://resend.com/signup
2. Login → API Keys → Create API Key
3. Copy API key ke `.env`:

```env
RESEND_API_KEY="re_YourAPIKey"
EMAIL_FROM="Cikal Pet Care Polman <onboarding@resend.dev>"
```

📖 Panduan lengkap: [RESEND_SETUP_GUIDE.md](RESEND_SETUP_GUIDE.md)

### 5. Run Development Server (1 menit)

```bash
npm run dev
```

🎉 Buka: http://localhost:3000

### 6. Login Admin

- URL: http://localhost:3000/login
- Email: `admin@cikalpetcare.com`
- Password: `admin123`

---

## 📚 Dokumentasi Lengkap

- **[QUICK_START.md](QUICK_START.md)** - Panduan setup cepat 15 menit
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Dokumentasi lengkap semua integrasi
- **[CLOUDINARY_SETUP_GUIDE.md](CLOUDINARY_SETUP_GUIDE.md)** - Setup upload gambar
- **[RESEND_SETUP_GUIDE.md](RESEND_SETUP_GUIDE.md)** - Setup email notifications
- **[AUTHENTICATION.md](AUTHENTICATION.md)** - Panduan authentication
- **[PAYMENT_VERIFICATION.md](PAYMENT_VERIFICATION.md)** - Sistem pembayaran

---

## 🎯 Fitur yang Sudah Terintegrasi

✅ **Authentication** - NextAuth.js dengan route protection  
✅ **Database** - Prisma + SQLite dengan seed data  
✅ **Image Upload** - Cloudinary di Products, Blog, Payment  
✅ **Email** - Resend untuk order & payment notifications  
✅ **Admin Dashboard** - CRUD lengkap semua entitas  
✅ **Shopping Cart** - Zustand state management  
✅ **Payment System** - Upload & verify bukti transfer  
✅ **Responsive Design** - Mobile-first UI/UX  
✅ **WhatsApp Integration** - Float button & auto-message  

---

## 📂 Struktur Project

```
cikal-pet-care/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin Dashboard
│   │   ├── blog/           # Blog CRUD + upload
│   │   ├── orders/         # Order management
│   │   ├── products/       # Product CRUD + upload
│   │   ├── services/       # Service CRUD
│   │   └── settings/       # Settings
│   ├── api/                # API Routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── blog/           # Blog API
│   │   ├── orders/         # Orders API + email
│   │   ├── products/       # Products API
│   │   ├── services/       # Services API
│   │   └── upload/         # Cloudinary upload
│   ├── blog/               # Public blog
│   ├── booking/            # Booking layanan
│   ├── cara-pembayaran/    # Payment guide + upload
│   ├── checkout/           # Checkout page
│   ├── kontak/             # Contact page
│   ├── layanan/            # Services page
│   ├── login/              # Admin login
│   ├── pesanan/            # Order tracking
│   ├── produk/             # Products catalog
│   └── ...
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Sample data
│   └── migrations/         # Database migrations
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── logo.svg
│   └── placeholder-product.svg
├── src/
│   ├── components/         # Reusable components
│   │   ├── FileUpload.tsx  # Upload component
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Cart.tsx
│   │   └── ...
│   ├── services/          # Business logic
│   │   ├── emailService.ts   # Email templates
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   └── ...
│   ├── store/             # Zustand stores
│   │   └── cartStore.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── .env                   # Environment variables
├── middleware.ts          # Route protection
├── next.config.js
├── prisma.schema
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔐 Environment Variables

Salin `.env.example` menjadi `.env`, isi nilainya, lalu enkripsi file tersebut:

```bash
npm run env:encrypt
```

Perintah ini mengubah nilai di `.env` menjadi ciphertext dan membuat `.env.keys`. File kunci tersebut sudah diabaikan Git dan tidak boleh dibagikan. Semua script aplikasi yang membutuhkan environment otomatis mendekripsi nilai hanya di memori melalui `dotenvx`.

Untuk deployment, simpan nilai `DOTENV_PRIVATE_KEY` dari `.env.keys` di secret manager/platform deployment. Jangan menaruh private key di repository. Untuk mengedit konfigurasi lokal, jalankan `npm run env:decrypt`, ubah nilainya, lalu segera jalankan kembali `npm run env:encrypt`.

Isi awal `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

# Resend Email (REQUIRED)
RESEND_API_KEY="re_YourActualAPIKey"
EMAIL_FROM="Cikal Pet Care Polman <onboarding@resend.dev>"

# Cloudinary (REQUIRED)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 🧪 Testing Fitur

### Test Upload Gambar
1. Login admin → Kelola Produk
2. Tambah Produk → Upload gambar
3. ✅ Gambar tersimpan di Cloudinary

### Test Email Notifications
1. Buat order di frontend
2. Cek email → Order confirmation
3. Admin verify payment
4. Cek email → Payment confirmation

### Test Payment System
1. Checkout order
2. Upload bukti transfer
3. Admin verify di dashboard
4. Status berubah → Email terkirim

---

## 📱 Pages

### Public Pages
- 🏠 **Homepage** - Hero, featured products, services
- 🛍️ **Produk** - Katalog produk dengan filter & search
- 💆 **Layanan** - Grooming, konsultasi, vaksinasi, dll
- 📝 **Blog** - Artikel tips & kesehatan kucing
- 📅 **Booking** - Form booking layanan
- 🛒 **Checkout** - Shopping cart & order form
- 💳 **Cara Pembayaran** - Instruksi & upload bukti
- 📦 **Pesanan** - Track order by number
- 📞 **Kontak** - Info kontak & lokasi
- ❓ **FAQ** - Pertanyaan umum

### Admin Pages
- 📊 **Dashboard** - Statistics overview
- 📦 **Kelola Produk** - CRUD + upload
- 💆 **Kelola Layanan** - CRUD
- 📝 **Kelola Blog** - CRUD + featured image
- 📋 **Kelola Orders** - Verify payment, update status
- ⚙️ **Settings** - Konfigurasi website

---

## 🚀 Deployment

Schema saat ini menggunakan SQLite. Jalankan aplikasi pada Node.js host/container dengan persistent volume untuk file database. Jangan deploy konfigurasi SQLite ini ke filesystem ephemeral seperti Vercel Functions karena data dapat hilang saat instance diganti.

Mengganti `DATABASE_URL` saja tidak mengubah SQLite menjadi PostgreSQL/MySQL. Migrasi database tersebut memerlukan perubahan provider Prisma, migration baru, dan pemindahan data terencana.

### Checklist Production

1. Gunakan `AUTH_SECRET` acak minimal 32 karakter dan `AUTH_URL` domain HTTPS.
2. Gunakan absolute `DATABASE_URL`, misalnya `file:/data/cikal.db`, pada persistent volume.
3. Jalankan `npm run db:migrate` sebelum memulai versi aplikasi baru.
4. Atur Cloudinary dan Resend, lalu verifikasi domain pengirim email.
5. Jadwalkan `npm run db:backup`; simpan `BACKUP_DIR` pada volume terpisah atau off-host storage.
6. Monitor `GET /api/health`; status `200` berarti aplikasi dapat membaca database dan `503` berarti tidak siap menerima traffic.
7. Terminasi TLS di reverse proxy dan hanya teruskan traffic HTTPS ke domain publik.
8. Konfigurasikan reverse proxy untuk menghapus lalu menulis ulang `X-Forwarded-For`; rate limiter tidak boleh menerima header tersebut langsung dari client.

Rate limiter bawaan bersifat per-process dan dibatasi 10.000 identity. Jalankan satu instance aplikasi untuk deployment SQLite ini. Deployment multi-instance harus mengganti store rate limit dengan Redis atau layanan shared rate limiting.

### Urutan Deploy

1. Hentikan traffic atau instance lama jika migration mengubah schema yang tidak kompatibel.
2. Jalankan `npm run db:backup` dan salin snapshot tervalidasi ke object storage/off-host storage.
3. Jalankan `npm run db:migrate` pada persistent database yang sama dengan aplikasi.
4. Jalankan `npm run build`, lalu `npm start` dengan environment production.
5. Arahkan traffic hanya setelah `GET /api/health` mengembalikan status `200`.

### Restore SQLite

1. Hentikan seluruh instance aplikasi agar tidak ada proses yang menulis database.
2. Simpan salinan database aktif dan file `-wal`/`-shm` jika ada untuk kebutuhan investigasi.
3. Pilih snapshot dari `BACKUP_DIR`, lalu jalankan `PRAGMA integrity_check` terhadap snapshot tersebut.
4. Salin snapshot ke path absolute pada `DATABASE_URL`; jangan ikut memulihkan file `-wal`/`-shm` lama.
5. Jalankan `npm run db:migrate`, mulai aplikasi, lalu pastikan `/api/health` berstatus `200` dan lakukan smoke test login/order.

Uji prosedur restore secara berkala di host non-production. Retention lokal bukan disaster recovery; setiap backup harus direplikasi ke storage di luar host dan dienkripsi sesuai kebijakan operasional.

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build untuk production
npm start               # Run production build

# Database
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npm run db:seed        # Seed database
npm run db:migrate     # Apply migration production
npm run db:backup      # Online SQLite backup + retention

# Utilities
npm run lint           # Run ESLint
npm run type-check     # TypeScript check
```

---

## 📞 Support & Contact

**Cikal Pet Care Polman**  
📱 WhatsApp: 0852-5547-8706  
📧 Email: admin@cikalpetcare.com  
🌐 Website: [Coming Soon]  

---

## 📄 License

MIT License - Copyright (c) 2026 Cikal Pet Care Polman

---

## 🙏 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Resend](https://resend.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

**🎉 Website Siap Digunakan!**

Lihat [QUICK_START.md](QUICK_START.md) untuk panduan lengkap setup 15 menit.

**Last Updated**: 18 Februari 2026
