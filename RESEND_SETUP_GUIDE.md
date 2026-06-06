# 📧 Panduan Setup Resend API untuk Email Notifications

## ✅ Status: Email Templates Complete - API Key Required

Email notification system sudah terinstall dan siap digunakan. Anda hanya perlu menambahkan API key dari Resend.

---

## 🚀 Langkah Setup (10 Menit)

### 1. Buat Akun Resend (GRATIS)

**Kunjungi**: https://resend.com/signup

**Free Tier Benefits:**
- ✅ 100 email/hari GRATIS selamanya
- ✅ 3,000 email/bulan
- ✅ Tidak perlu kartu kredit
- ✅ Sempurna untuk testing & production awal

**Daftar dengan:**
- Email Anda (untuk login)
- Password (minimal 8 karakter)

---

### 2. Verifikasi Email

Setelah daftar, cek inbox email Anda:
1. Buka email dari Resend
2. Klik tombol "Verify Email"
3. Login ke dashboard Resend

---

### 3. Dapatkan API Key

#### Di Dashboard Resend:

1. **Klik "API Keys"** di menu kiri
2. **Klik tombol "Create API Key"**
3. **Isi form:**
   - **Name**: `Cikal Pet Care - Production` (atau nama bebas)
   - **Permission**: Pilih "Sending access"
4. **Klik "Add"**
5. **PENTING**: Copy API key yang muncul (contoh: `re_AbCdEfGh_1234567890`)
   - ⚠️ Key ini HANYA MUNCUL SEKALI
   - ⚠️ Simpan di tempat aman
   - ⚠️ Jika hilang, harus buat key baru

---

### 4. Setup Domain (Opsional - Recommended)

**Opsi A: Gunakan Domain Sendiri (Recommended)**

Jika Anda punya domain (misal: `cikalpetcare.com`):

1. Di Resend Dashboard → klik "Domains"
2. Klik "Add Domain"
3. Masukkan domain Anda (tanpa www): `cikalpetcare.com`
4. Copy DNS records yang diberikan
5. Tambahkan DNS records ke domain provider Anda (contoh: Cloudflare, Namecheap, Niagahoster)
6. Tunggu verifikasi (biasanya 5-30 menit)

**DNS Records yang perlu ditambahkan:**
```
Type: TXT
Name: @
Value: [akan diberikan oleh Resend]

Type: MX
Name: @
Priority: 10
Value: [akan diberikan oleh Resend]

Type: CNAME
Name: resend._domainkey
Value: [akan diberikan oleh Resend]
```

**Opsi B: Gunakan Test Domain Resend (Untuk Testing)**

Resend menyediakan test domain: `onboarding.resend.dev`
- ⚠️ Email hanya bisa dikirim ke email yang sudah didaftarkan di Resend
- ⚠️ Tidak bisa untuk production
- ✅ Bagus untuk testing awal

---

### 5. Update Environment Variables

Buka file `.env` di root project, update baris berikut:

#### Jika Sudah Punya Domain:
```env
RESEND_API_KEY="re_AbCdEfGh_1234567890"
EMAIL_FROM="Cikal Pet Care Polman <noreply@cikalpetcare.com>"
```

#### Jika Menggunakan Test Domain:
```env
RESEND_API_KEY="re_AbCdEfGh_1234567890"
EMAIL_FROM="Cikal Pet Care Polman <onboarding@resend.dev>"
```

**Replace:**
- `re_AbCdEfGh_1234567890` → API key Anda yang sebenarnya
- `cikalpetcare.com` → domain Anda yang sebenarnya (jika punya)

---

### 6. Restart Dev Server

Setelah update `.env`:

```powershell
# Stop server yang sedang berjalan (Ctrl+C di terminal)
# Lalu jalankan lagi:
npm run dev
```

---

## 🧪 Testing Email Notifications

### Test 1: Payment Confirmation Email

1. Login sebagai admin: http://localhost:3001/login
2. Buka menu "Kelola Pesanan"
3. Pilih pesanan yang sudah upload bukti bayar
4. Klik tombol "✅ Lunas"
5. Konfirmasi
6. **Check**: Email dikirim ke customer email

Email berisi:
- ✅ Konfirmasi pembayaran diterima
- 📦 Detail pesanan
- 💰 Total pembayaran
- 📞 Kontak customer service (0852-5547-8706)

### Test 2: Order Status Update Email

1. Masih di detail pesanan
2. Update order status (misal: "Diproses" atau "Selesai")
3. Konfirmasi
4. **Check**: Email status update dikirim ke customer

Email berisi:
- 📋 Update status pesanan
- 🎨 Warna & icon sesuai status:
  - **Dikonfirmasi**: Blue (✅)
  - **Diproses**: Purple (🔄)
  - **Selesai**: Green (🎉)
  - **Dibatalkan**: Red (❌)

---

## 📊 Monitor Email Logs

Di Resend Dashboard:
1. Klik "Logs" di menu kiri
2. Lihat semua email yang terkirim:
   - ✅ Delivered
   - ⏳ Pending
   - ❌ Failed (dengan error reason)

**Track:**
- Berapa email terkirim hari ini
- Email mana yang dibuka customer
- Email mana yang gagal terkirim

---

## ⚠️ Troubleshooting

### Error: "Missing API Key"
```
✅ Solusi: 
- Pastikan RESEND_API_KEY di .env sudah terisi
- Restart dev server setelah update .env
- Cek tidak ada spasi atau kutip ganda ekstra
```

### Error: "Domain not verified"
```
✅ Solusi:
- Gunakan test domain dulu: onboarding@resend.dev
- Atau tunggu DNS propagation (maksimal 24 jam)
- Cek status domain di Resend Dashboard → Domains
```

### Email Tidak Sampai
```
✅ Solusi:
- Cek spam folder
- Cek email Logs di Resend Dashboard
- Pastikan email customer valid
- Jika pakai domain sendiri, pastikan sudah verified
```

### Error: "Rate limit exceeded"
```
✅ Solusi:
- Free tier: 100 email/hari
- Tunggu 24 jam untuk reset
- Atau upgrade ke paid plan jika butuh lebih banyak
```

---

## 💰 Pricing (Jika Perlu Upgrade)

**Free Forever:**
- 100 emails/hari
- 3,000 emails/bulan
- Sempurna untuk bisnis kecil

**Paid Plans (Jika Bisnis Berkembang):**
- **$20/bulan**: 50,000 emails
- **$40/bulan**: 100,000 emails
- **Custom**: Unlimited emails

**Note**: Start dengan free plan dulu, upgrade nanti jika perlu.

---

## 🎯 Email Templates Yang Sudah Ready

### 1. Payment Confirmation Email
**File**: `src/services/emailService.ts` → `sendPaymentConfirmationEmail()`

**Trigger**: Admin klik "Lunas" pada payment status

**Design Features:**
- 🎨 Gradient header (Blue → Purple)
- 💳 Payment info dengan badge status
- 📦 Order details dengan items list
- 💰 Total amount prominent
- 📞 Contact info (Email + WhatsApp: 0852-5547-8706)
- 🎨 Beautiful HTML design dengan inline CSS

### 2. Order Status Update Email
**File**: `src/services/emailService.ts` → `sendOrderStatusUpdateEmail()`

**Trigger**: Admin update order status

**Dynamic Content:**
- **Dikonfirmasi**: "Pesanan Anda Dikonfirmasi!" (Blue)
- **Diproses**: "Pesanan Sedang Diproses!" (Purple)
- **Selesai**: "Pesanan Selesai!" (Green)
- **Dibatalkan**: "Pesanan Dibatalkan" (Red)

**Design Features:**
- Status-specific colors & icons
- Order tracking timeline
- Next steps information
- Customer support contact

---

## ✅ Checklist Setup

- [ ] Buat akun Resend
- [ ] Verifikasi email
- [ ] Dapatkan API key
- [ ] (Opsional) Setup domain sendiri
- [ ] Update .env dengan API key & EMAIL_FROM
- [ ] Restart dev server
- [ ] Test payment confirmation email
- [ ] Test order status update email
- [ ] Check Resend Logs dashboard
- [ ] Verifikasi email sampai ke customer

---

## 📞 Support

**Jika Ada Masalah:**
1. Cek Resend Dashboard → Logs untuk error details
2. Cek console browser untuk error messages
3. Pastikan .env sudah benar
4. Restart dev server setelah perubahan .env

**Resend Support:**
- Docs: https://resend.com/docs
- Support: support@resend.com
- Discord: https://resend.com/discord

---

## 🎉 Setelah Setup Complete

Sistem email notification Anda akan:
- ✅ Otomatis kirim email konfirmasi pembayaran
- ✅ Otomatis kirim email update status pesanan
- ✅ Beautiful branded emails dengan logo & warna brand
- ✅ Contact info lengkap (Email + WhatsApp)
- ✅ Professional & trustworthy untuk customer

**Estimated Setup Time:** 10 menit
**Difficulty:** ⭐⭐☆☆☆ (Easy)

---

**Last Updated**: February 18, 2026
**Status**: Ready for Implementation 🚀
