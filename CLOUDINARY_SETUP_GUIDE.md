# 📸 Panduan Setup Cloudinary untuk Upload Gambar

## ✅ Status: Upload System Complete - API Credentials Required

Image upload system sudah terinstall dan siap digunakan. Anda hanya perlu menambahkan credentials dari Cloudinary.

---

## 🚀 Langkah Setup (5 Menit)

### 1. Buat Akun Cloudinary (GRATIS)

**Kunjungi**: https://cloudinary.com/users/register_free

**Free Tier Benefits:**
- ✅ 25 GB storage GRATIS
- ✅ 25 GB bandwidth/bulan
- ✅ 1 juta transformasi/bulan
- ✅ Tidak perlu kartu kredit
- ✅ Unlimited uploads
- ✅ Sempurna untuk production!

**Daftar dengan:**
- Nama lengkap
- Email Anda
- Password (minimal 8 karakter)

**Atau gunakan:**
- Login dengan Google
- Login dengan GitHub

---

### 2. Verifikasi Email

Setelah daftar, cek inbox email Anda:
1. Buka email dari Cloudinary
2. Klik tombol "Verify your account"
3. Login ke Cloudinary Dashboard

---

### 3. Dapatkan Credentials

#### Di Cloudinary Dashboard:

Setelah login, Anda akan langsung melihat **Dashboard** dengan credentials di bagian atas:

```
Account Details
├── Cloud name:     your_cloud_name
├── API Key:        123456789012345
└── API Secret:     abcdefghijklmnopqrstuv (click "eye" icon to reveal)
```

**Copy ketiga nilai ini:**
1. **Cloud Name**: Nama cloud Anda (contoh: `dpqr8abcd`)
2. **API Key**: Angka panjang (contoh: `123456789012345`)
3. **API Secret**: String alfanumerik (klik icon mata 👁️ untuk lihat)

---

### 4. Update Environment Variables

Buka file `.env` di root project, update baris berikut:

```env
# Cloudinary Image Upload
CLOUDINARY_CLOUD_NAME="dpqr8abcd"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuv"
```

**Replace dengan:**
- Cloud name Anda
- API Key Anda
- API Secret Anda (jangan lupa klik icon mata untuk reveal)

⚠️ **PENTING**: 
- Jangan bagikan API Secret ke siapapun
- Jangan commit .env ke Git
- API Secret sudah ada di `.gitignore`

---

### 5. Restart Dev Server

Setelah update `.env`:

```powershell
# Stop server yang sedang berjalan (Ctrl+C di terminal)
# Lalu jalankan lagi:
npm run dev
```

---

## 🎨 Fitur Upload Yang Sudah Ready

### 1. FileUpload Component
**File**: `src/components/FileUpload.tsx`

**Features:**
- 📤 Drag & drop support
- 👁️ Live preview sebelum upload
- ⚡ Auto-upload ke Cloudinary
- 🔄 Loading indicator
- ✅ Success/error notifications
- 🗑️ Remove/replace gambar
- 📏 Validasi ukuran (max 5MB)
- 🎨 Validasi format (JPG, PNG, WebP)

### 2. Upload API Route
**File**: `app/api/upload/route.ts`

**Endpoints:**
- **POST /api/upload**: Upload gambar
- **DELETE /api/upload**: Hapus gambar

**Features:**
- ✨ Auto image optimization (max width 1200px)
- 🎯 Auto quality optimization
- 📁 Organize dalam folder `cikal-pet-care`
- 🔒 Secure upload dengan validation
- 📊 Return image details (URL, size, format)

---

## 📦 Dimana Upload Digunakan?

### 1. Admin - Tambah/Edit Produk
**Page**: http://localhost:3001/admin/produk

**Untuk:**
- Upload gambar produk baru
- Update gambar produk existing
- Preview produk sebelum save

### 2. Admin - Tambah/Edit Service
**Page**: http://localhost:3001/admin/layanan

**Untuk:**
- Upload gambar layanan (grooming, pet hotel, dll)
- Update gambar service existing

### 3. Customer - Upload Bukti Bayar
**Page**: http://localhost:3001/checkout (setelah order)

**Untuk:**
- Upload bukti transfer pembayaran
- Admin bisa verifikasi melalui payment modal

---

## 🧪 Testing Upload System

### Test 1: Upload Produk Image

1. Login sebagai admin: http://localhost:3001/login
2. Buka menu "Kelola Produk"
3. Klik "Tambah Produk Baru"
4. Di form, lihat field "Upload Gambar"
5. **Cara 1**: Klik area upload → pilih file
6. **Cara 2**: Drag & drop gambar ke area upload
7. Wait for upload (akan ada loading indicator)
8. Preview muncul setelah upload selesai
9. Isi form lainnya → Simpan
10. **Check**: Gambar muncul di daftar produk

### Test 2: Replace/Remove Image

1. Edit produk yang sudah ada gambarnya
2. Hover di preview gambar → klik tombol ❌ (remove)
3. Upload gambar baru
4. **Check**: Gambar lama terganti

### Test 3: Upload Payment Proof

1. Buat order sebagai customer
2. Pilih metode "Transfer Bank"
3. Upload bukti transfer
4. **Check**: 
   - Upload berhasil
   - Admin bisa lihat bukti di "Kelola Pesanan"

---

## 📊 Monitor Uploads di Cloudinary

### Di Cloudinary Dashboard:

1. **Media Library**:
   - Klik "Media Library" di sidebar
   - Lihat semua gambar yang sudah diupload
   - Organize dalam folder: `cikal-pet-care/`

2. **Usage Statistics**:
   - Klik "Dashboard"
   - Lihat berapa storage terpakai
   - Lihat berapa bandwidth terpakai
   - Track transformations

3. **Image Details**:
   - Klik gambar di Media Library
   - Info: URL, size, dimensions, format
   - Transformations applied
   - Copy URL untuk digunakan

---

## ⚙️ Image Optimization (Auto)

Sistem sudah auto-optimize setiap gambar:

```typescript
Transformations:
├── Max Width: 1200px (auto resize jika lebih besar)
├── Quality: auto:good (balance antara quality & size)
└── Format: auto (serve WebP untuk browser yang support)
```

**Benefits:**
- 🚀 Website loading lebih cepat
- 💾 Hemat bandwidth
- 📱 Responsive di semua device
- 🎨 Quality tetap bagus

---

## ⚠️ Troubleshooting

### Error: "Cloudinary belum dikonfigurasi"
```
✅ Solusi:
- Pastikan semua 3 credentials di .env sudah terisi:
  * CLOUDINARY_CLOUD_NAME
  * CLOUDINARY_API_KEY
  * CLOUDINARY_API_SECRET
- Restart dev server setelah update .env
- Cek tidak ada spasi atau kutip ganda ekstra
```

### Error: "Format file tidak didukung"
```
✅ Solusi:
- Gunakan format: JPG, PNG, atau WebP
- Convert dari format lain (GIF, BMP, TIFF) ke JPG dulu
```

### Error: "Ukuran file terlalu besar"
```
✅ Solusi:
- Max size: 5MB
- Compress gambar dulu:
  * Online: tinypng.com, compressor.io
  * Software: Photoshop, GIMP
- Resize gambar jika terlalu besar (misal 4000x3000 → 1200x900)
```

### Upload Stuck/Loading Forever
```
✅ Solusi:
- Check koneksi internet
- Reload page
- Clear browser cache
- Check console log untuk error messages
```

### Image Tidak Muncul di Website
```
✅ Solusi:
- Check Network tab di browser DevTools
- Pastikan URL gambar valid
- Check Cloudinary Dashboard → Media Library
- Verify credentials di .env
```

---

## 🔐 Security Best Practices

### ✅ Yang Sudah Diterapkan:
1. **File validation**: Hanya accept JPG, PNG, WebP
2. **Size limit**: Max 5MB
3. **API Secret**: Tidak pernah exposed ke client
4. **Signed uploads**: Only through server API route
5. **Folder organization**: Semua file di folder terpisah

### ⚠️ Tips Security:
- Jangan hardcode credentials di code
- Jangan commit .env ke Git
- Jangan share API Secret
- Rotate API Secret jika tercuri
- Monitor usage di Cloudinary Dashboard

---

## 💰 Free Tier Limits

**Cloudinary Free Plan:**
- ✅ **Storage**: 25 GB
- ✅ **Bandwidth**: 25 GB/bulan
- ✅ **Transformations**: 1 juta/bulan
- ✅ **Upload**: Unlimited

**Estimasi Capacity:**
```
Jika rata-rata gambar 500 KB:
├── Storage: ~50,000 gambar
├── Bandwidth: ~50,000 views/bulan
└── Cukup untuk startup sampai menengah!
```

**Paid Plans (Jika Butuh Lebih):**
- **$99/bulan**: 150 GB storage + bandwidth
- **Custom**: Unlimited dengan fitur advanced

**Note**: Start dengan free plan, monitor usage, upgrade jika perlu.

---

## 🎯 Folder Structure di Cloudinary

Semua upload otomatis masuk folder:

```
cikal-pet-care/
├── product_abc123.jpg
├── product_def456.png
├── service_xyz789.jpg
├── payment_proof_order123.jpg
└── ... (auto organized)
```

**Benefits:**
- Mudah manage
- Mudah backup
- Mudah delete by folder
- Terorganisir & professional

---

## 📱 Advanced Features (Opsional)

### 1. Create Upload Presets
Di Cloudinary Dashboard:
- Settings → Upload → Add upload preset
- Set default transformations
- Easier management

### 2. Auto Tagging
- Auto tag uploads by folder
- Easier search & filter
- Better organization

### 3. Backup & Download
- Backup semua gambar regularly
- Download by folder via Media Library
- Export URLs for migration

---

## ✅ Checklist Setup

- [ ] Buat akun Cloudinary (FREE)
- [ ] Verifikasi email
- [ ] Copy Cloud Name dari Dashboard
- [ ] Copy API Key dari Dashboard
- [ ] Reveal & copy API Secret (klik icon mata)
- [ ] Update .env dengan 3 credentials
- [ ] Restart dev server
- [ ] Test upload produk image
- [ ] Test replace/remove image
- [ ] Test upload payment proof
- [ ] Check Media Library di Cloudinary
- [ ] Verify semua gambar ter-organize dengan baik

---

## 📞 Support

**Jika Ada Masalah:**
1. Check browser console untuk error messages
2. Check Network tab untuk failed requests
3. Verify credentials di .env
4. Check Cloudinary Status page: status.cloudinary.com

**Cloudinary Support:**
- Docs: https://cloudinary.com/documentation
- Support: support@cloudinary.com
- Community: https://support.cloudinary.com

---

## 🎉 Setelah Setup Complete

Website Anda akan punya:
- ✅ Professional image upload system
- ✅ Drag & drop support
- ✅ Auto image optimization
- ✅ Fast loading times
- ✅ Unlimited uploads (dalam free tier limits)
- ✅ Organized media library
- ✅ Secure & scalable

**Estimated Setup Time:** 5 menit
**Difficulty:** ⭐☆☆☆☆ (Very Easy)

---

**Last Updated**: February 18, 2026
**Status**: Ready for Implementation 🚀
