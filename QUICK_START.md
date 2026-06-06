# 🚀 QUICK START GUIDE - CIKAL PET CARE POLMAN

**5 Langkah Setup Cepat (15 Menit)**

---

## ✅ SUDAH SELESAI

- ✅ Website complete
- ✅ Database ready
- ✅ Semua fitur terintegrasi
- ✅ Seed data siap pakai

**Yang Perlu Anda Lakukan: Setup 2 Service External**

---

## 📝 LANGKAH 1: INSTALL & SETUP DATABASE (2 menit)

```bash
# Install dependencies
npm install

# Generate Prisma
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database dengan sample data
npm run db:seed
```

✅ Database siap dengan:
- 1 Admin user
- 10 Products
- 7 Services
- 4 Penitipan packages
- 3 Blog posts

---

## 🖼️ LANGKAH 2: SETUP CLOUDINARY (5 menit)

**Untuk Upload Gambar (Produk, Blog, Bukti Bayar)**

### A. Daftar Cloudinary (GRATIS)
1. Buka: https://cloudinary.com/users/register_free
2. Daftar dengan Google/Email
3. Verify email Anda
4. Login ke Dashboard

### B. Dapatkan Credentials
Di Dashboard → Settings → Access Keys:

```
Cloud Name: your_cloud_name_here
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

### C. Update .env
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
```

✅ Upload gambar langsung dari admin dashboard!

**Free Tier**: 25GB storage, 25GB bandwidth/bulan

---

## 📧 LANGKAH 3: SETUP RESEND (5 menit)

**Untuk Email Notifications (Order, Payment, Status)**

### A. Daftar Resend (GRATIS)
1. Buka: https://resend.com/signup
2. Daftar dengan Google/Email
3. Verify email Anda
4. Login ke Dashboard

### B. Dapatkan API Key
1. Klik "API Keys" di sidebar
2. Klik "Create API Key"
3. Name: "Cikal Pet Care"
4. Permission: "Full Access"
5. Copy API Key (dimulai dengan `re_`)

### C. Update .env
```env
RESEND_API_KEY="re_AbCd1234_YourActualAPIKey"
```

### D. Setup Email Sender

**Untuk Testing (Gunakan domain Resend)**:
```env
EMAIL_FROM="Cikal Pet Care Polman <onboarding@resend.dev>"
```

**Untuk Production (Setelah verify domain)**:
```env
EMAIL_FROM="Cikal Pet Care Polman <noreply@cikalpetcare.com>"
```

✅ Email otomatis terkirim ke customer!

**Free Tier**: 100 emails/hari, 3,000 emails/bulan

---

## 🎯 LANGKAH 4: JALANKAN SERVER (1 menit)

```bash
npm run dev
```

Server berjalan di: **http://localhost:3000**

---

## 🔐 LANGKAH 5: LOGIN ADMIN (1 menit)

1. Buka: http://localhost:3000/login
2. Login dengan:
   - **Email**: `admin@cikalpetcare.com`
   - **Password**: `admin123`
3. Klik "Login"

✅ Anda masuk ke Admin Dashboard!

---

## 🧪 TEST FITUR (5 menit)

### 1. Test Upload Gambar Produk
1. Dashboard → Kelola Produk → Tambah Produk
2. Isi form
3. **Upload gambar** (drag & drop atau klik)
4. Simpan
5. ✅ Gambar muncul di Cloudinary!

### 2. Test Buat Order & Email
1. Buka homepage (buka incognito/logout)
2. Tambah produk ke cart
3. Checkout → isi data customer
4. Submit order
5. ✅ Cek email → Order confirmation terkirim!

### 3. Test Upload Bukti Bayar
1. Di halaman Cara Pembayaran
2. Upload bukti transfer
3. ✅ Bukti tersimpan!

### 4. Test Verify Payment (Admin)
1. Login admin → Orders
2. Klik order yang baru
3. Update payment status → "Lunas"
4. ✅ Email payment confirmation terkirim!

---

## 📁 STRUKTUR PROJECT

```
cikal-pet-care/
├── app/                  # Pages & API
│   ├── admin/           # ✅ Admin Dashboard
│   ├── api/             # ✅ Backend APIs
│   └── ...              # ✅ Public pages
├── prisma/
│   ├── schema.prisma    # ✅ Database schema
│   └── seed.ts          # ✅ Sample data
├── src/
│   ├── components/      # ✅ UI components
│   │   └── FileUpload   # ✅ Upload component
│   └── services/        # ✅ Business logic
│       └── emailService # ✅ Email service
└── .env                 # ⚠️ UPDATE INI!
```

---

## ⚙️ FILE .env LENGKAP

```env
# Database
DATABASE_URL="file:./dev.db"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=6285255478706

# NextAuth
AUTH_SECRET="cikal-pet-care-secret-key-change-in-production-2026"
NEXTAUTH_URL="http://localhost:3000"

# ⚠️ UPDATE INI - Resend Email
RESEND_API_KEY="re_YourActualAPIKey"
EMAIL_FROM="Cikal Pet Care Polman <onboarding@resend.dev>"

# ⚠️ UPDATE INI - Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## ✅ FITUR YANG SUDAH TERINTEGRASI

### 🔐 Authentication
- [x] Login admin
- [x] Session management
- [x] Route protection

### 💾 Database
- [x] Products, Services, Orders
- [x] Blog, Customers
- [x] Penitipan packages & bookings
- [x] Seed data ready

### 🖼️ Upload Gambar (Cloudinary)
- [x] Products
- [x] Blog featured images
- [x] Payment proof
- [x] Drag & drop

### 📧 Email (Resend)
- [x] Order confirmation
- [x] Payment confirmation
- [x] Order status updates

### 🎨 UI/UX
- [x] Responsive design
- [x] Toast notifications
- [x] Loading states
- [x] WhatsApp float button
- [x] Shopping cart

### 📱 Admin Dashboard
- [x] Products CRUD + upload
- [x] Services CRUD
- [x] Blog CRUD + upload
- [x] Orders management
- [x] Payment verification
- [x] Statistics

---

## 🆘 TROUBLESHOOTING

### Port 3000 sudah digunakan?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Atau gunakan port lain
npm run dev -- -p 3001
```

### Error "Cloudinary not configured"?
- Cek `.env` → pastikan CLOUDINARY_* sudah terisi
- Restart dev server: `Ctrl+C` lalu `npm run dev`

### Email tidak terkirim?
- Cek `.env` → pastikan RESEND_API_KEY valid
- Cek console log untuk error message
- Test API key di Resend dashboard

### Database error?
```bash
# Reset database
rm prisma/dev.db
npx prisma migrate dev
npm run db:seed
```

---

## 📚 DOKUMENTASI LENGKAP

- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Dokumentasi lengkap semua integrasi
- [CLOUDINARY_SETUP_GUIDE.md](CLOUDINARY_SETUP_GUIDE.md) - Panduan detail Cloudinary
- [RESEND_SETUP_GUIDE.md](RESEND_SETUP_GUIDE.md) - Panduan detail Resend
- [AUTHENTICATION.md](AUTHENTICATION.md) - Panduan authentication
- [PAYMENT_VERIFICATION.md](PAYMENT_VERIFICATION.md) - Panduan payment system

---

## 🎉 SELESAI!

**WEBSITE SIAP DIGUNAKAN!**

Sekarang Anda bisa:
- ✅ Kelola produk & layanan
- ✅ Upload gambar dengan mudah
- ✅ Terima & proses orders
- ✅ Kirim email otomatis ke customer
- ✅ Verify pembayaran
- ✅ Kelola blog & artikel

**Selamat menggunakan Cikal Pet Care Website!** 🐱🐾

---

**Butuh bantuan?** Baca dokumentasi atau hubungi developer.

**Last Updated**: 18 Februari 2026
