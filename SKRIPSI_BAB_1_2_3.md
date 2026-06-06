# SKRIPSI

## RANCANG BANGUN SISTEM INFORMASI MANAJEMEN LAYANAN PERAWATAN KUCING BERBASIS WEB
## (Studi Kasus: Cikal Pet Care Polewali Mandar)

---

**Diajukan sebagai Syarat untuk Menyelesaikan Program Studi Strata Satu (S1)**  
**Program Studi Teknik Informatika / Sistem Informasi**

---

---

# ABSTRAK

**Rancang Bangun Sistem Informasi Manajemen Layanan Perawatan Kucing Berbasis Web (Studi Kasus: Cikal Pet Care Polewali Mandar)**

Pertumbuhan industri perawatan hewan peliharaan di Indonesia terus meningkat signifikan, namun banyak pelaku usaha di sektor ini masih mengelola operasionalnya secara manual dan konvensional. Cikal Pet Care Polewali Mandar, sebagai salah satu usaha layanan perawatan kucing yang berkembang di Sulawesi Barat, menghadapi berbagai permasalahan operasional meliputi pencatatan data pelanggan yang masih menggunakan buku catatan, proses pemesanan layanan melalui WhatsApp, manajemen stok produk yang tidak terintegrasi, serta tidak adanya media penjualan online. Penelitian ini bertujuan untuk merancang dan membangun sistem informasi manajemen layanan perawatan kucing berbasis web sebagai solusi atas permasalahan tersebut.

Metode pengembangan yang digunakan adalah SDLC model Waterfall dengan empat tahapan utama: analisis kebutuhan, perancangan sistem, implementasi, dan pengujian. Sistem dibangun menggunakan teknologi Next.js v16 sebagai framework utama, TypeScript, Prisma ORM, dan SQLite sebagai basis data, serta berbagai pustaka pendukung seperti NextAuth.js v5, Cloudinary, Resend, Zustand, Recharts, Zod, Bcryptjs, dan Tailwind CSS.

Hasil penelitian berupa sistem informasi manajemen berbasis web yang mencakup delapan modul utama: manajemen produk dan e-commerce, sistem booking layanan online, manajemen penitipan kucing (pet boarding), manajemen pesanan dengan verifikasi pembayaran, dashboard analitik dan laporan, manajemen konten blog, sistem notifikasi email otomatis, serta manajemen pengaturan website. Pengujian sistem dilakukan menggunakan metode Black Box Testing dengan 20 skenario uji coba yang seluruhnya menghasilkan output sesuai dengan yang diharapkan. Sistem yang dibangun mampu mengintegrasikan seluruh proses operasional Cikal Pet Care dalam satu platform berbasis web yang responsif dan mudah digunakan, sehingga diharapkan dapat meningkatkan efisiensi operasional dan kualitas pelayanan kepada pelanggan.

**Kata kunci:** sistem informasi manajemen, layanan perawatan kucing, Next.js, Prisma ORM, web-based application

---

---

# BAB I
# PENDAHULUAN

---

## 1.1 Latar Belakang

Perkembangan teknologi informasi dan komunikasi yang sangat pesat pada era digital ini telah membawa perubahan besar dalam berbagai aspek kehidupan manusia, termasuk dalam dunia bisnis dan layanan jasa. Pemanfaatan sistem informasi berbasis web telah menjadi kebutuhan yang tidak dapat dielakkan bagi pelaku usaha yang ingin tetap kompetitif dan relevan di tengah persaingan yang semakin ketat. Sistem informasi yang terintegrasi mampu meningkatkan efisiensi operasional, mempermudah pengelolaan data, serta meningkatkan kualitas pelayanan kepada pelanggan (Rainer & Prince, 2023).

Salah satu sektor yang mengalami pertumbuhan signifikan di Indonesia adalah industri perawatan hewan peliharaan, khususnya kucing. Berdasarkan data American Pet Products Association (APPA, 2023), industri perawatan hewan peliharaan secara global bernilai lebih dari USD 232 miliar dan terus menunjukkan tren kenaikan setiap tahunnya. Di Indonesia, fenomena ini juga tercermin nyata: survei Populix (2023) mencatat bahwa 41% rumah tangga di Indonesia memelihara hewan peliharaan, di mana kucing menempati posisi teratas sebagai hewan peliharaan yang paling diminati. Tren memelihara kucing semakin meningkat seiring dengan perubahan gaya hidup masyarakat perkotaan maupun semi-perkotaan; kucing dianggap mudah dirawat, tidak membutuhkan ruang besar, dan memiliki nilai kompanion (companion value) yang tinggi bagi pemiliknya (Fitriani & Rahmat, 2022). Di Sulawesi Barat khususnya, pertumbuhan komunitas pecinta kucing turut mendorong kebutuhan terhadap layanan perawatan hewan yang profesional dan terstandar, termasuk di Kabupaten Polewali Mandar sebagai salah satu pusat ekonomi dan permukiman yang berkembang di provinsi tersebut.

Cikal Pet Care merupakan salah satu usaha layanan perawatan kucing yang berlokasi di Kabupaten Polewali Mandar, Sulawesi Barat. Usaha ini berdiri sebagai respons atas meningkatnya kebutuhan masyarakat setempat terhadap layanan perawatan hewan peliharaan yang terpercaya dan terjangkau. Cikal Pet Care menyediakan berbagai layanan komprehensif meliputi grooming (perawatan kebersihan bulu, kuku, dan telinga kucing), layanan penitipan kucing (pet boarding), konsultasi kesehatan kucing, vaksinasi, serta penjualan produk-produk kebutuhan kucing seperti makanan premium, aksesoris, dan obat-obatan. Dengan pertumbuhan jumlah pelanggan yang terus meningkat — tercatat lebih dari 1.000 kucing telah mendapatkan layanan sejak beroperasi — pengelolaan bisnis yang masih dilakukan secara konvensional dan manual mulai menunjukkan berbagai keterbatasan yang berdampak nyata pada kualitas dan konsistensi layanan.

Berdasarkan hasil observasi dan wawancara yang dilakukan oleh peneliti dengan pemilik Cikal Pet Care, ditemukan berbagai permasalahan operasional yang dihadapi. Pertama, pencatatan data pelanggan, data kucing, dan riwayat layanan masih dilakukan secara manual menggunakan buku catatan dan lembar kertas sehingga sangat rentan terhadap kehilangan data, kerusakan, dan kesulitan dalam pencarian informasi secara cepat. Kedua, proses pemesanan layanan (booking) oleh pelanggan masih dilakukan melalui pesan WhatsApp secara langsung kepada pemilik, yang mengakibatkan penumpukan pesan dan potensi terlewatnya jadwal booking pelanggan. Ketiga, manajemen stok produk (makanan kucing, obat, aksesoris) belum terkelola dengan baik sehingga sering terjadi ketidaksesuaian antara stok fisik dan catatan yang ada. Keempat, pembuatan laporan keuangan dan laporan operasional dilakukan secara manual setiap periode yang membutuhkan waktu lama dan berpotensi mengandung kesalahan. Kelima, tidak adanya media promosi dan penjualan produk secara online menyebabkan jangkauan pasar Cikal Pet Care terbatas hanya pada pelanggan yang datang langsung ke lokasi.

Permasalahan-permasalahan di atas menuntut adanya solusi teknologi yang dapat mengotomatisasi proses bisnis, mempermudah pengelolaan data, serta meningkatkan aksesibilitas layanan bagi pelanggan. Pengembangan sistem informasi manajemen berbasis web merupakan solusi yang tepat untuk menjawab tantangan tersebut. Sistem berbasis web dipilih karena bersifat platform-independent, dapat diakses dari berbagai perangkat (komputer, smartphone, tablet) tanpa perlu instalasi aplikasi khusus, serta memudahkan pemeliharaan dan pembaruan sistem (Sommerville, 2021).

Beberapa penelitian terdahulu telah membuktikan efektivitas penerapan sistem informasi manajemen berbasis web pada usaha sejenis. Penelitian Rahayu et al. (2021) pada Pet Shop Berbasis Web menghasilkan sistem yang mampu meningkatkan efisiensi pengelolaan layanan sebesar 65%. Penelitian Santoso & Wibowo (2020) pada sistem informasi veteriner menunjukkan bahwa digitalisasi proses booking dapat mengurangi tingkat kesalahan jadwal hingga 80%. Penelitian Kurniawan et al. (2022) pada sistem manajemen pet boarding menunjukkan kepuasan pelanggan meningkat signifikan setelah implementasi sistem berbasis web. Hal ini semakin memperkuat relevansi penelitian ini untuk dilakukan.

Berdasarkan uraian latar belakang di atas, peneliti termotivasi untuk melakukan penelitian dengan judul **"Rancang Bangun Sistem Informasi Manajemen Layanan Perawatan Kucing Berbasis Web (Studi Kasus: Cikal Pet Care Polewali Mandar)"**. Sistem yang akan dibangun mencakup modul manajemen produk, manajemen layanan, sistem booking online, manajemen penitipan kucing (pet boarding), manajemen pesanan (order management), dashboard laporan dan analitik, manajemen konten blog, serta sistem notifikasi email otomatis. Dengan menggunakan teknologi Next.js, Prisma ORM, dan database SQLite, diharapkan sistem ini dapat menjadi solusi komprehensif yang meningkatkan efisiensi operasional dan kualitas pelayanan Cikal Pet Care Polewali Mandar.

---

## 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah dipaparkan di atas, maka rumusan masalah dalam penelitian ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun sistem informasi manajemen layanan perawatan kucing berbasis web yang dapat mengelola data produk, layanan, booking, penitipan, dan pesanan secara terintegrasi pada Cikal Pet Care Polewali Mandar?

2. Bagaimana merancang sistem booking online dan manajemen penitipan kucing (pet boarding) yang memudahkan pelanggan dalam melakukan pemesanan layanan secara mandiri?

3. Bagaimana merancang dashboard administrasi yang dapat menghasilkan laporan operasional dan laporan keuangan secara otomatis untuk mendukung pengambilan keputusan manajemen Cikal Pet Care Polewali Mandar?

---

## 1.3 Tujuan Penelitian

Berdasarkan rumusan masalah yang telah dikemukakan, maka tujuan dari penelitian ini adalah:

1. Merancang dan membangun sistem informasi manajemen layanan perawatan kucing berbasis web yang terintegrasi untuk mendukung operasional Cikal Pet Care Polewali Mandar, mencakup modul manajemen produk, manajemen layanan, sistem booking, manajemen penitipan, manajemen pesanan, dan manajemen pelanggan.

2. Membangun fitur booking online dan manajemen penitipan kucing yang memungkinkan pelanggan melakukan pemesanan layanan kapan saja dan di mana saja tanpa harus datang langsung ke lokasi atau menghubungi melalui WhatsApp.

3. Membangun dashboard administrasi yang dilengkapi dengan fitur pelaporan otomatis dan visualisasi data (grafik dan statistik) untuk memudahkan manajemen Cikal Pet Care dalam memantau kinerja bisnis dan membuat keputusan strategis.

---

## 1.4 Manfaat Penelitian

### 1.4.1 Manfaat Teoritis

1. Penelitian ini diharapkan dapat memberikan kontribusi ilmiah pada bidang pengembangan sistem informasi manajemen berbasis web, khususnya dalam konteks usaha layanan perawatan hewan peliharaan.

2. Penelitian ini dapat menjadi referensi bagi peneliti selanjutnya yang ingin mengkaji pengembangan sistem informasi serupa dengan studi kasus yang berbeda.

3. Menambah khazanah literatur ilmiah tentang penerapan teknologi Next.js, Prisma ORM, dan arsitektur web modern dalam pengembangan sistem informasi manajemen usaha kecil dan menengah (UKM).

### 1.4.2 Manfaat Praktis

1. **Bagi Cikal Pet Care Polewali Mandar**: Memiliki sistem informasi manajemen yang terintegrasi sehingga proses operasional menjadi lebih efisien, data lebih terorganisir, dan pelayanan kepada pelanggan lebih optimal.

2. **Bagi Pelanggan**: Memudahkan pelanggan dalam mengakses informasi layanan, melakukan pemesanan layanan (booking) secara online, memantau status pesanan, serta mendapatkan notifikasi melalui email secara otomatis.

3. **Bagi Peneliti**: Meningkatkan kemampuan dan pengalaman dalam merancang serta mengimplementasikan sistem informasi berbasis web menggunakan teknologi-teknologi terkini.

4. **Bagi Akademik**: Menjadi tambahan referensi karya ilmiah di perpustakaan yang dapat dimanfaatkan oleh mahasiswa dan dosen sebagai bahan kajian penelitian selanjutnya.

---

## 1.5 Batasan Masalah

Agar penelitian ini lebih terarah dan fokus, maka ditetapkan batasan-batasan masalah sebagai berikut:

1. Sistem yang dibangun berbasis web dan hanya dapat diakses melalui browser internet; tidak mencakup pengembangan aplikasi mobile native (Android/iOS).

2. Database yang digunakan adalah SQLite dengan Prisma ORM sebagai Object Relational Mapping tool; sistem belum dioptimalkan untuk skala enterprise dengan jutaan data.

3. Sistem informasi yang dibangun mencakup modul-modul berikut:
   - Manajemen produk (CRUD produk beserta varian dan galeri foto)
   - Manajemen layanan perawatan (grooming, konsultasi, vaksinasi, dll.)
   - Sistem booking layanan online
   - Manajemen penitipan kucing (pet boarding) beserta paket-paketnya
   - Manajemen pesanan (order management) dengan verifikasi pembayaran
   - Manajemen pelanggan
   - Dashboard laporan dan analitik
   - Manajemen konten blog dan artikel
   - Manajemen pengaturan website (tampilan, sosial media, kontak)
   - Sistem autentikasi administrator (login/logout)

4. Metode pembayaran yang didukung meliputi transfer bank, QRIS, dan COD (Cash on Delivery); integrasi payment gateway otomatis (seperti Midtrans atau Xendit) tidak termasuk dalam ruang lingkup penelitian ini.

5. Pengujian sistem dilakukan menggunakan metode Black Box Testing dan hanya mencakup pengujian fungsionalitas sistem tanpa melibatkan pengujian beban (load testing) atau pengujian keamanan penetrasi (penetration testing) secara mendalam.

6. Studi kasus terbatas pada Cikal Pet Care yang berlokasi di Kabupaten Polewali Mandar, Sulawesi Barat.

---

## 1.6 Sistematika Penulisan

Sistematika penulisan skripsi ini terdiri dari lima bab dengan susunan sebagai berikut:

**BAB I PENDAHULUAN**
Bab ini menguraikan latar belakang penelitian, rumusan masalah, tujuan penelitian, manfaat penelitian, batasan masalah, dan sistematika penulisan skripsi.

**BAB II TINJAUAN PUSTAKA**
Bab ini membahas landasan teori yang menjadi dasar penelitian, meliputi konsep sistem informasi, sistem informasi manajemen, pengembangan sistem berbasis web, teknologi-teknologi yang digunakan (Next.js, React, TypeScript, Prisma ORM, SQLite, Tailwind CSS, NextAuth.js, Cloudinary, Resend, Zustand, Recharts, Zod, dan Bcryptjs), metode pengembangan sistem, serta penelitian-penelitian terdahulu yang relevan.

**BAB III METODOLOGI PENELITIAN**
Bab ini menjelaskan jenis penelitian, lokasi dan waktu penelitian, metode pengumpulan data, metode pengembangan sistem menggunakan model Waterfall yang mencakup analisis kebutuhan (fungsional dan non-fungsional), perancangan sistem (arsitektur sistem, use case diagram, activity diagram, sequence diagram, entity relationship diagram, struktur database, dan desain antarmuka), implementasi sistem, serta rencana pengujian dengan metode Black Box Testing. Selain itu bab ini juga memuat definisi operasional variabel-variabel kunci, alat dan bahan penelitian, serta diagram alir penelitian secara keseluruhan.

**BAB IV HASIL DAN PEMBAHASAN**
Bab ini menyajikan hasil implementasi sistem yang telah dibangun, tampilan antarmuka sistem, hasil pengujian Black Box Testing, serta analisis dan pembahasan terhadap hasil penelitian yang diperoleh.

**BAB V PENUTUP**
Bab ini berisi kesimpulan yang ditarik dari hasil penelitian serta saran-saran untuk pengembangan sistem lebih lanjut di masa mendatang.

**DAFTAR PUSTAKA**
Memuat seluruh referensi yang digunakan dalam penulisan skripsi ini.

**LAMPIRAN**
Memuat data-data pendukung penelitian seperti hasil wawancara, kuesioner pengujian, kode program, dan dokumentasi foto.

---
---

# BAB II
# TINJAUAN PUSTAKA

---

## 2.1 Landasan Teori

### 2.1.1 Sistem Informasi

Sistem informasi merupakan kombinasi dari teknologi informasi dan aktivitas manusia yang menggunakan teknologi tersebut untuk mendukung operasi dan manajemen organisasi (Laudon & Laudon, 2020). Menurut Rainer & Prince (2023), sistem informasi adalah kombinasi terorganisasi dari manusia, hardware, software, jaringan komunikasi, sumber data, serta kebijakan dan prosedur yang menyimpan, memulihkan, mengubah, dan menyebarkan informasi dalam suatu organisasi.

Sistem informasi memiliki tiga aktivitas utama yang menghasilkan informasi yang dibutuhkan organisasi dalam pengambilan keputusan, pengendalian operasi, analisis masalah, dan penciptaan produk atau layanan baru (Laudon & Laudon, 2020):

1. **Input**: Menangkap atau mengumpulkan data mentah dari dalam maupun dari luar lingkungan organisasi.
2. **Processing**: Mengkonversi input data mentah menjadi bentuk yang lebih bermakna.
3. **Output**: Mentransfer informasi yang telah diproses kepada orang-orang yang akan menggunakannya atau kepada aktivitas yang akan menggunakan informasi tersebut.

Menurut Kadir (2020), komponen sistem informasi terdiri atas: (1) blok masukan (input block), (2) blok model (model block), (3) blok keluaran (output block), (4) blok teknologi (technology block), (5) blok basis data (database block), dan (6) blok kendali (control block).

### 2.1.2 Sistem Informasi Manajemen

Sistem Informasi Manajemen (SIM) adalah sistem informasi yang menyediakan informasi yang dibutuhkan oleh aktivitas manajemen (Turban et al., 2021). SIM dirancang khusus untuk menyediakan laporan rutin, mendukung pengambilan keputusan terstruktur, dan memberikan akses data kepada manajer dan karyawan.

Menurut Rainer & Prince (2023), sistem informasi manajemen adalah sistem berbasis komputer yang menyediakan informasi bagi beberapa pemakai yang mempunyai kebutuhan yang serupa. Para pemakai biasanya membentuk suatu entitas organisasi formal, seperti perusahaan atau sub unit di bawahnya. Informasi SIM menjelaskan perusahaan atau salah satu sistem utamanya mengenai apa yang telah terjadi di masa lalu, apa yang sedang terjadi sekarang, dan apa yang mungkin terjadi di masa depan.

Karakteristik Sistem Informasi Manajemen yang baik menurut Laudon & Laudon (2020):
1. Menghasilkan informasi yang akurat, tepat waktu, dan relevan.
2. Mampu mendukung proses pengambilan keputusan.
3. Mudah digunakan (user friendly).
4. Dapat diintegrasikan dengan sistem lain.
5. Memiliki keamanan data yang memadai.
6. Fleksibel dan dapat dikembangkan sesuai kebutuhan organisasi.

### 2.1.3 Sistem Informasi Berbasis Web

Sistem informasi berbasis web (web-based information system) adalah sistem informasi yang menggunakan teknologi web (internet) sebagai media utama pengaksesan dan pengelolaan data (Elmasri & Navathe, 2023). Sistem ini memiliki keunggulan dibandingkan sistem desktop konvensional, antara lain:

1. **Platform-independent**: Dapat diakses dari berbagai sistem operasi (Windows, macOS, Linux, Android, iOS) menggunakan web browser.
2. **Aksesibilitas tinggi**: Dapat diakses dari mana saja selama terhubung dengan internet.
3. **Kemudahan pemeliharaan**: Pembaruan sistem hanya perlu dilakukan di server tanpa perlu menginstal ulang di sisi klien.
4. **Skalabilitas**: Dapat dikembangkan dan diperluas sesuai pertumbuhan kebutuhan bisnis.
5. **Kolaborasi real-time**: Memungkinkan banyak pengguna mengakses dan memodifikasi data secara bersamaan.
6. **Biaya operasional lebih rendah**: Tidak memerlukan investasi infrastruktur yang besar di sisi pengguna (Sommerville, 2021).

### 2.1.4 Rekayasa Perangkat Lunak

Rekayasa perangkat lunak (software engineering) adalah disiplin ilmu yang membahas semua aspek produksi perangkat lunak mulai dari tahap awal spesifikasi sistem hingga pemeliharaan sistem setelah digunakan (Sommerville, 2021). Tujuan utama rekayasa perangkat lunak adalah menghasilkan perangkat lunak yang berkualitas tinggi dalam batas waktu dan biaya yang telah ditetapkan.

Menurut Pressman & Maxim (2019), atribut kualitas perangkat lunak yang baik mencakup:
- **Maintainability**: Kemudahan dalam melakukan perubahan dan pemeliharaan.
- **Dependability**: Keandalan sistem dalam beroperasi.
- **Efficiency**: Efisiensi penggunaan sumber daya sistem.
- **Usability**: Kemudahan penggunaan oleh pengguna akhir.

### 2.1.5 Model Pengembangan Sistem (SDLC - Waterfall)

Systems Development Life Cycle (SDLC) adalah proses terstruktur yang digunakan untuk merencanakan, membuat, menguji, dan mengimplementasikan sistem informasi (Dennis et al., 2021). Model waterfall adalah salah satu model SDLC yang paling klasik dan sering digunakan, dengan tahapan yang bersifat sekuensial dan sistematis.

Menurut Pressman & Maxim (2019), tahapan model waterfall meliputi:

1. **Requirements Analysis (Analisis Kebutuhan)**: Mengumpulkan dan mendokumentasikan seluruh kebutuhan sistem yang akan dibangun, baik kebutuhan fungsional maupun non-fungsional.

2. **System Design (Perancangan Sistem)**: Menerjemahkan kebutuhan sistem ke dalam rancangan arsitektur sistem, desain basis data, desain antarmuka pengguna, dan desain komponen-komponen sistem.

3. **Implementation (Implementasi)**: Melakukan pengkodean program berdasarkan rancangan yang telah dibuat. Setiap unit program dikembangkan dan diuji secara individual (unit testing).

4. **Testing (Pengujian)**: Mengintegrasikan seluruh unit program dan melakukan pengujian sistem secara menyeluruh untuk memastikan sistem memenuhi semua kebutuhan yang telah ditetapkan.

5. **Deployment (Penerapan)**: Menempatkan sistem ke lingkungan produksi yang sesungguhnya dan memberikan pelatihan kepada pengguna.

6. **Maintenance (Pemeliharaan)**: Melakukan perbaikan bug, pembaruan fitur, dan adaptasi sistem terhadap perubahan lingkungan setelah sistem diterapkan.

Model waterfall dipilih dalam penelitian ini karena kebutuhan sistem telah terdefinisi dengan jelas sejak awal melalui hasil analisis dan wawancara, serta cocok untuk proyek dengan tim kecil dan batasan waktu yang terdefinisi (Sommerville, 2021).

---

## 2.2 Teknologi yang Digunakan

### 2.2.1 Next.js

Next.js adalah framework React open-source yang dikembangkan oleh Vercel dan digunakan untuk membangun aplikasi web full-stack yang modern dan berperforma tinggi (Vercel, 2024). Next.js menyediakan fitur-fitur unggulan seperti Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), dan App Router yang memungkinkan pengembangan aplikasi web yang optimal dari sisi performa dan SEO.

Fitur-fitur utama Next.js yang dimanfaatkan dalam penelitian ini:

1. **App Router**: Sistem routing berbasis folder yang lebih intuitif dan mendukung React Server Components.
2. **API Routes**: Memungkinkan pembuatan endpoint API backend langsung di dalam proyek Next.js tanpa memerlukan server terpisah.
3. **Server Components**: Komponen yang di-render di sisi server, mengurangi ukuran JavaScript yang dikirim ke klien.
4. **Image Optimization**: Optimasi gambar otomatis untuk meningkatkan performa loading halaman.
5. **Built-in TypeScript Support**: Dukungan TypeScript bawaan tanpa konfigurasi tambahan yang kompleks (Next.js Documentation, 2024).

### 2.2.2 React.js

React.js adalah library JavaScript open-source yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (user interface) yang interaktif dan efisien (Meta Open Source, 2024). React menggunakan konsep Virtual DOM yang memungkinkan pembaruan antarmuka secara efisien hanya pada bagian yang berubah, tanpa perlu me-render ulang seluruh halaman.

Konsep-konsep utama React yang digunakan:
- **Components**: Blok bangunan UI yang dapat digunakan kembali (reusable).
- **Props & State**: Mekanisme pengelolaan data dan status komponen.
- **Hooks**: Fitur yang memungkinkan penggunaan state dan fitur React lainnya dalam functional components (useState, useEffect, useContext, dll.).
- **Context API**: Mekanisme berbagi state antar komponen tanpa perlu prop drilling (Meta Open Source, 2024).

### 2.2.3 TypeScript

TypeScript adalah superset dari JavaScript yang dikembangkan oleh Microsoft dan menambahkan sistem typing statis (static type system) pada JavaScript (Microsoft, 2024). Penggunaan TypeScript dalam pengembangan sistem memiliki beberapa keunggulan:

1. **Type Safety**: Mendeteksi kesalahan tipe data saat proses kompilasi (sebelum runtime), mengurangi bug pada aplikasi produksi.
2. **Better IDE Support**: Autocompletion, refactoring, dan navigasi kode yang lebih baik.
3. **Self-documenting Code**: Kode menjadi lebih mudah dipahami karena tipe data terdefinisi dengan eksplisit.
4. **Scalability**: Lebih mudah mengelola codebase yang besar dan kompleks.
5. **Interoperability**: Kompatibel penuh dengan JavaScript; kode JavaScript yang ada dapat digunakan langsung dalam proyek TypeScript (TypeScript Documentation, 2024).

### 2.2.4 Prisma ORM

Prisma adalah Object Relational Mapping (ORM) generasi terbaru untuk Node.js dan TypeScript yang menyediakan antarmuka type-safe untuk berinteraksi dengan database (Prisma, 2024). Prisma terdiri dari tiga komponen utama:

1. **Prisma Client**: Query builder yang auto-generated dan type-safe berdasarkan schema database.
2. **Prisma Migrate**: Alat untuk manajemen migrasi schema database yang deklaratif.
3. **Prisma Studio**: Antarmuka GUI untuk melihat dan mengedit data database secara visual.

Keunggulan Prisma ORM dibandingkan ORM konvensional:
- Type-safety penuh dari database hingga antarmuka pengguna.
- Query API yang intuitif dan mudah dipelajari.
- Performa query yang optimal melalui N+1 query prevention.
- Mendukung berbagai database: PostgreSQL, MySQL, SQLite, SQL Server, MongoDB (Prisma, 2024).

### 2.2.5 SQLite dan Better-SQLite3

SQLite adalah sistem manajemen database relasional (RDBMS) yang ringan dan bersifat serverless, artinya database disimpan dalam sebuah file tunggal di sistem file lokal (Hipp, 2024). SQLite sangat cocok untuk aplikasi skala kecil hingga menengah karena:
- Tidak memerlukan proses server database terpisah.
- Konfigurasi yang sangat minimal (zero-configuration).
- Portabel dan mudah di-backup (hanya perlu menyalin satu file).
- Performa baca yang sangat cepat untuk aplikasi dengan beban baca yang dominan.

Better-sqlite3 adalah library Node.js yang menyediakan antarmuka synchronous ke SQLite, memberikan performa yang lebih baik dibandingkan library sqlite3 yang asynchronous karena eliminasi overhead callback dan Promise (better-sqlite3, 2024).

### 2.2.6 Tailwind CSS

Tailwind CSS adalah framework CSS utility-first yang menyediakan sekumpulan kelas-kelas utilitas level rendah yang dapat dikombinasikan langsung di HTML/JSX untuk membangun desain antarmuka yang kustom tanpa perlu menulis CSS dari awal (Tailwind Labs, 2024). Pendekatan utility-first ini memberikan keunggulan:

1. **Produktivitas tinggi**: Tidak perlu berpindah antara file HTML dan CSS.
2. **Konsistensi desain**: Design system yang konsisten melalui konfigurasi tema terpusat.
3. **File size kecil**: Proses PurgeCSS otomatis menghapus kelas yang tidak digunakan di produksi.
4. **Responsive design**: Prefix responsif (sm:, md:, lg:, xl:) yang intuitif untuk desain mobile-first.
5. **Kustomisasi tinggi**: Dapat dikonfigurasi sesuai kebutuhan desain spesifik proyek (Tailwind Labs, 2024).

### 2.2.7 NextAuth.js (Auth.js v5)

NextAuth.js (sekarang Auth.js) adalah library autentikasi open-source yang komprehensif untuk aplikasi Next.js (Auth.js, 2024). Library ini menyederhanakan implementasi autentikasi dengan mendukung berbagai provider autentikasi (OAuth, credentials, email, dll.) dan fitur-fitur keamanan modern.

Fitur-fitur yang digunakan dalam penelitian ini:
- **Credentials Provider**: Autentikasi menggunakan email dan password yang disimpan di database.
- **Session Management**: Pengelolaan sesi pengguna yang aman menggunakan JWT (JSON Web Token).
- **Middleware Protection**: Perlindungan route berdasarkan status autentikasi pengguna.
- **Role-based Access Control**: Pembatasan akses fitur berdasarkan peran pengguna (Super Admin, Admin, Staff) (Auth.js, 2024).

### 2.2.8 Cloudinary

Cloudinary adalah platform cloud untuk manajemen media (gambar dan video) yang menyediakan layanan penyimpanan, transformasi, optimasi, dan pengiriman media secara otomatis (Cloudinary, 2024). Penggunaan Cloudinary dalam sistem ini memungkinkan:

1. **Cloud Storage**: Penyimpanan gambar produk, layanan, dan konten blog di cloud, mengurangi beban penyimpanan server.
2. **Automatic Optimization**: Optimasi ukuran dan format gambar secara otomatis berdasarkan perangkat dan browser pengguna.
3. **Image Transformation**: Resize, crop, dan transformasi gambar secara on-the-fly melalui URL parameter.
4. **CDN Delivery**: Pengiriman gambar melalui Content Delivery Network untuk loading yang lebih cepat (Cloudinary, 2024).

### 2.2.9 Resend (Email Service)

Resend adalah layanan pengiriman email transaksional modern yang dibangun khusus untuk developer (Resend, 2024). Dalam sistem Cikal Pet Care, Resend digunakan untuk:

1. Notifikasi konfirmasi booking layanan kepada pelanggan.
2. Notifikasi konfirmasi pesanan (order) dan pembaruan status pesanan.
3. Notifikasi verifikasi pembayaran.
4. Notifikasi konfirmasi penitipan kucing (check-in/check-out).

Resend dipilih karena memiliki API yang sederhana, deliverability yang tinggi, dukungan template HTML yang fleksibel, dan integrasi yang mudah dengan React melalui paket `resend` npm (Resend, 2024).

### 2.2.10 Zustand

Zustand adalah library manajemen state untuk React yang ringan, minimal, dan tidak opinionated (Pmndrs, 2024). Dalam penelitian ini, Zustand digunakan untuk mengelola state keranjang belanja (shopping cart) pelanggan di sisi klien. Keunggulan Zustand dibandingkan Redux yang lebih kompleks:
- API yang sederhana (hanya beberapa baris kode untuk setup store).
- Tidak memerlukan Provider wrapper di root komponen.
- Performa optimal dengan re-render minimal.
- Dukungan persistensi state ke localStorage bawaan (Zustand Documentation, 2024).

### 2.2.11 Recharts

Recharts adalah library visualisasi data (charting) untuk React yang dibangun di atas komponen SVG dan D3.js (Recharts, 2024). Dalam sistem dashboard administrasi Cikal Pet Care, Recharts digunakan untuk menampilkan:
- Grafik pendapatan enam bulan terakhir (Bar Chart).
- Distribusi status pesanan berdasarkan kategori (Pie Chart / Donut Chart).
- Ringkasan statistik pesanan berdasarkan status (card numerik).

### 2.2.12 Zod

Zod adalah library validasi schema TypeScript-first yang memungkinkan deklarasi validasi data dengan type inference otomatis (Colinhacks, 2024). Dalam sistem ini, Zod digunakan untuk:
- Validasi input form di sisi klien (frontend).
- Validasi data request di sisi server (API routes).
- Memastikan integritas data sebelum diproses ke database.

### 2.2.13 Bcryptjs

Bcryptjs adalah implementasi JavaScript murni dari algoritma hashing bcrypt yang digunakan untuk mengamankan password pengguna (Drangies, 2024). Dalam sistem autentikasi Cikal Pet Care, bcryptjs digunakan untuk:
- Hashing password administrator sebelum disimpan ke database.
- Verifikasi password saat proses login.

Bcrypt dipilih karena merupakan algoritma yang direkomendasikan untuk hashing password, dengan fitur cost factor yang dapat disesuaikan untuk menyeimbangkan keamanan dan performa (OWASP, 2024).

---

## 2.3 Unified Modeling Language (UML)

UML (Unified Modeling Language) adalah bahasa pemodelan standar yang digunakan untuk memvisualisasikan, merancang, dan mendokumentasikan sistem perangkat lunak berorientasi objek (Dennis et al., 2021). UML terdiri dari berbagai jenis diagram yang masing-masing memiliki tujuan dan fokus yang berbeda.

### 2.3.1 Use Case Diagram

Use case diagram menggambarkan fungsionalitas sistem dari sudut pandang pengguna (aktor) dan interaksi antara aktor dengan sistem (Satzinger et al., 2022). Komponen utama use case diagram:
- **Actor**: Pengguna atau sistem eksternal yang berinteraksi dengan sistem.
- **Use Case**: Fungsi atau layanan yang disediakan sistem.
- **Relationship**: Hubungan antara aktor dan use case (association, include, extend, generalization).

### 2.3.2 Activity Diagram

Activity diagram menggambarkan alur kerja (workflow) atau proses bisnis dari sebuah sistem secara berurutan (Dennis et al., 2021). Diagram ini berguna untuk menggambarkan logika proses yang kompleks dan alur pengambilan keputusan.

### 2.3.3 Sequence Diagram

Sequence diagram menggambarkan interaksi antar objek dalam sistem secara berurutan berdasarkan waktu (Satzinger et al., 2022). Diagram ini menunjukkan bagaimana pesan dikirim dan diterima antar komponen sistem.

### 2.3.4 Entity Relationship Diagram (ERD)

ERD adalah representasi grafis dari entitas-entitas dalam suatu sistem dan hubungan antar entitas tersebut (Elmasri & Navathe, 2023). ERD digunakan sebagai dasar perancangan struktur database sistem.

---

## 2.4 Konsep Sistem yang Dikembangkan

### 2.4.1 Manajemen Produk (E-Commerce)

Sistem e-commerce (electronic commerce) adalah proses pembelian dan penjualan produk secara elektronik melalui jaringan internet (Turban et al., 2021). Modul manajemen produk dalam sistem ini mencakup pengelolaan katalog produk, varian produk, stok, harga, kategori, dan gambar produk. Sistem juga mendukung keranjang belanja (shopping cart) dan proses checkout dengan berbagai metode pembayaran.

### 2.4.2 Sistem Booking Online

Sistem booking online adalah sistem yang memungkinkan pelanggan melakukan pemesanan jadwal layanan secara mandiri melalui antarmuka web (Gaur & Sharma, 2022). Sistem booking yang baik harus mampu:
- Menampilkan ketersediaan jadwal secara real-time.
- Memvalidasi ketersediaan slot waktu dan mencegah double booking.
- Mengirimkan konfirmasi booking secara otomatis.
- Memungkinkan pengelolaan dan pembaruan status booking oleh administrator.

### 2.4.3 Manajemen Penitipan Hewan (Pet Boarding)

Pet boarding atau penitipan hewan adalah layanan penginapan sementara untuk hewan peliharaan saat pemilik hewan tidak dapat merawatnya (misalnya saat bepergian) (Campbell, 2021). Sistem manajemen penitipan mencakup pengelolaan paket penitipan, jadwal check-in dan check-out, kapasitas kandang, dan informasi kondisi hewan selama penitipan.

### 2.4.4 Dashboard Analitik dan Pelaporan

Dashboard analitik adalah antarmuka visual yang menyajikan informasi dan indikator kinerja utama (Key Performance Indicator/KPI) suatu organisasi dalam format yang ringkas dan mudah dipahami (Evergreen, 2022). Dashboard yang efektif membantu manajemen dalam memantau kinerja bisnis secara real-time dan membuat keputusan berbasis data (data-driven decision making).

Menurut Turban et al. (2021), dashboard yang baik memiliki karakteristik: (1) menyajikan informasi yang relevan dan dapat ditindaklanjuti; (2) mudah dipahami secara visual melalui grafik dan diagram; (3) dapat menampilkan data real-time atau near real-time; (4) dapat dikustomisasi sesuai kebutuhan pengguna. Dalam penelitian ini, dashboard admin Cikal Pet Care menampilkan KPI utama berupa: total pendapatan keseluruhan, total pesanan (beserta jumlah yang masih menunggu verifikasi), jumlah produk aktif, dan jumlah layanan yang tersedia. Dashboard juga menyajikan grafik pendapatan enam bulan terakhir (Bar Chart), grafik distribusi status pesanan (Pie Chart), dan tabel pesanan terbaru — semuanya dirender menggunakan library Recharts.

### 2.4.5 Grooming Kucing

Grooming kucing adalah serangkaian kegiatan perawatan fisik kucing yang bertujuan menjaga kebersihan, kesehatan, dan penampilan kucing secara optimal (Schlueter & Grandin, 2019). Grooming profesional mencakup berbagai aktivitas seperti: (1) mandi dan pengeringan bulu; (2) penyisiran dan trimming (pemangkasan) bulu; (3) pembersihan telinga dari kotoran dan tungau; (4) pemotongan kuku; (5) pembersihan gigi; dan (6) pembersihan area mata dari kotoran.

Menurut American Association of Feline Practitioners (AAFP, 2021), grooming rutin tidak hanya berfungsi untuk kebersihan estetika, tetapi juga merupakan bagian penting dari pemeliharaan kesehatan kucing. Grooming yang teratur dapat mendeteksi kondisi kulit, parasit (kutu, tungau), benjolan abnormal, atau tanda-tanda penyakit sejak dini. Dalam konteks bisnis, layanan grooming profesional menjadi salah satu layanan dengan permintaan tertinggi di pet care center karena banyak pemilik kucing tidak memiliki keahlian atau peralatan yang memadai untuk melakukan grooming sendiri (Campbell, 2021).

### 2.4.6 Penitipan Kucing (Cat Boarding)

Penitipan kucing atau cat boarding adalah layanan akomodasi sementara di mana kucing dititipkan kepada pengelola yang kompeten saat pemilik tidak dapat merawatnya sendiri, misalnya saat bepergian jauh, sakit, atau dalam kondisi darurat (Campbell, 2021). Layanan penitipan yang berkualitas menyediakan lingkungan yang aman, nyaman, bersih, dan stimulatif bagi kucing selama periode penitipan.

Standar layanan penitipan kucing yang baik menurut International Boarding & Pet Services Association (IBPSA, 2022) mencakup: (1) kandang atau ruangan yang bersih dan berventilasi baik; (2) pemberian pakan sesuai jadwal dan jenis makanan yang biasa dikonsumsi kucing; (3) interaksi dan aktivitas bermain yang cukup; (4) pemantauan kesehatan harian; (5) ketersediaan akses ke dokter hewan jika diperlukan; dan (6) komunikasi rutin dengan pemilik tentang kondisi kucing. Dalam sistem Cikal Pet Care, layanan penitipan dikelola melalui paket-paket (PenitipanPackage) dengan tarif per malam yang berbeda sesuai dengan fasilitas yang disediakan.

---

## 2.5 Pengujian Sistem - Black Box Testing

Black box testing adalah metode pengujian perangkat lunak yang berfokus pada fungsionalitas eksternal sistem tanpa memperhatikan struktur internal kode program (Pressman & Maxim, 2019). Pengujian ini mengevaluasi apakah output yang dihasilkan sistem sesuai dengan output yang diharapkan berdasarkan input yang diberikan.

Keunggulan black box testing:
- Pengujian dilakukan dari perspektif pengguna akhir.
- Tidak memerlukan pengetahuan tentang kode internal program.
- Dapat menemukan kesenjangan antara spesifikasi dan implementasi.
- Efektif untuk menemukan kesalahan antarmuka, fungsi, dan akses database (Ammann & Offutt, 2022).

---

## 2.6 Penelitian Terdahulu

Tinjauan terhadap penelitian-penelitian terdahulu dilakukan sebagai dasar untuk memetakan posisi penelitian ini dalam lanskap ilmu pengetahuan yang sudah ada, sekaligus untuk mengidentifikasi celah (research gap) yang belum terisi oleh penelitian sebelumnya. Beberapa penelitian terdahulu yang relevan dengan penelitian ini adalah sebagai berikut:

| No | Peneliti (Tahun) | Judul | Metode | Hasil | Persamaan dengan Penelitian Ini |
|----|-----------------|-------|--------|-------|----------------------------------|
| 1 | Rahayu, D., Sari, R. P., & Nugroho, A. (2021) | Sistem Informasi Manajemen Pet Shop Berbasis Web Menggunakan Framework Laravel | Waterfall, Black Box Testing | Sistem berhasil dibangun dan meningkatkan efisiensi pengelolaan layanan pet shop sebesar 65% | Sama-sama membangun SIM pet care berbasis web dengan metode Waterfall dan pengujian Black Box |
| 2 | Santoso, B., & Wibowo, A. H. (2020) | Rancang Bangun Sistem Informasi Klinik Veteriner Berbasis Web | SDLC Waterfall | Sistem booking online mengurangi tingkat kesalahan jadwal hingga 80% | Sama-sama memiliki fitur booking online layanan dan manajemen data pelanggan berbasis web |
| 3 | Kurniawan, R., Pratiwi, M., & Hidayat, T. (2022) | Pengembangan Sistem Informasi Pet Boarding Berbasis Web | Prototyping, UML | Kepuasan pelanggan meningkat signifikan dari 60% menjadi 89% setelah implementasi sistem | Sama-sama mengembangkan fitur manajemen penitipan hewan (pet boarding) berbasis web |
| 4 | Fitriani, S., & Rahmat, A. (2022) | Analisis Pengembangan Bisnis Perawatan Kucing di Indonesia: Peluang dan Tantangan di Era Digital | Kualitatif Deskriptif | Bisnis perawatan kucing di Indonesia tumbuh 30% per tahun; digitalisasi menjadi faktor kunci daya saing | Sama-sama berfokus pada domain bisnis perawatan kucing di Indonesia dan urgensi digitalisasinya |
| 5 | Wijaya, H., & Susanto, E. (2023) | Implementasi Next.js dan Prisma ORM dalam Pengembangan Sistem Informasi Manajemen Berbasis Web | Eksperimental | Next.js dengan Prisma ORM menghasilkan aplikasi web dengan response time rata-rata 120ms, lebih cepat 45% dibandingkan framework konvensional | Sama-sama menggunakan Next.js dan Prisma ORM sebagai teknologi utama pengembangan |
| 6 | Purnama, R., & Dewi, L. A. (2023) | Sistem Informasi Penjualan dan Penitipan Hewan Peliharaan Berbasis Web (Studi Kasus: Rumah Anabul Yogyakarta) | Waterfall, Black Box Testing | Sistem berhasil mengintegrasikan modul penjualan produk, booking layanan, dan penitipan hewan dalam satu platform | Sama-sama mengintegrasikan modul penjualan produk, booking layanan, dan penitipan dalam satu sistem |
| 7 | Azzahra, F., Nurhidayat, M., & Ramadhan, A. (2023) | Penerapan Sistem E-commerce pada UMKM Perlengkapan Hewan Peliharaan Menggunakan ReactJS | Agile, UAT | Konversi penjualan online meningkat 120% dalam 3 bulan pertama implementasi | Sama-sama membangun fitur e-commerce untuk produk kebutuhan hewan peliharaan menggunakan teknologi React |
| 8 | Mahendra, I. G. B., & Rai, I. G. A. (2022) | Perancangan Sistem Informasi Veteriner Berbasis Web dengan Fitur Notifikasi Email Otomatis | Waterfall | Sistem notifikasi email otomatis meningkatkan tingkat konfirmasi booking dari 45% menjadi 92% | Sama-sama mengimplementasikan sistem notifikasi email otomatis untuk konfirmasi booking dan pesanan |

**Perbedaan dengan Penelitian Sebelumnya:**

Penelitian ini memiliki beberapa aspek kebaruan (novelty) yang membedakannya dari penelitian-penelitian terdahulu di atas, yaitu:

1. **Integrasi fitur yang lebih komprehensif dalam satu platform**: Berbeda dengan penelitian sebelumnya yang masing-masing berfokus pada satu atau dua fitur utama (hanya e-commerce, atau hanya pet boarding, atau hanya booking), penelitian ini mengintegrasikan secara penuh: manajemen produk (e-commerce), sistem booking layanan, manajemen penitipan kucing, laporan analitik, manajemen blog/konten, notifikasi email otomatis, dan pengaturan website — semuanya dalam satu aplikasi web yang terintegrasi.

2. **Penggunaan stack teknologi modern (Next.js 16 + App Router + TypeScript + Prisma ORM)**: Mayoritas penelitian sebelumnya menggunakan framework PHP (Laravel, CodeIgniter) atau React dengan Pages Router. Penelitian ini menggunakan Next.js terbaru dengan App Router yang memanfaatkan React Server Components dan TypeScript end-to-end untuk performa dan type-safety yang superior, sebuah kombinasi yang belum banyak diteliti dalam konteks SIM pet care.

3. **Spesifik untuk layanan perawatan kucing, bukan hewan peliharaan umum**: Penelitian ini dirancang secara khusus untuk alur bisnis perawatan kucing (feline-specific), mulai dari pencatatan jenis kucing, kebutuhan grooming kucing, hingga standar penitipan kucing yang spesifik — berbeda dengan sistem hewan peliharaan umum pada penelitian sebelumnya.

4. **Konteks lokal Sulawesi Barat yang belum pernah dikaji**: Belum ditemukan penelitian sejenis yang mengambil studi kasus dari Kabupaten Polewali Mandar, Sulawesi Barat. Penelitian ini berkontribusi pada pengembangan sistem informasi di daerah yang selama ini kurang terwakili dalam literatur akademik nasional terkait digitalisasi UMKM peternakan/pet care.

---

## 2.7 Kerangka Pikir

Berdasarkan uraian landasan teori dan penelitian terdahulu, berikut adalah kerangka pikir penelitian ini:

```
┌─────────────────────────────────────────────────────────────────┐
│                   IDENTIFIKASI MASALAH                          │
├─────────────────────────────────────────────────────────────────┤
│  • Pencatatan data pelanggan masih manual (buku catatan)        │
│  • Proses booking melalui WhatsApp (tidak terstruktur)          │
│  • Manajemen stok produk tidak terintegrasi                     │
│  • Pelaporan keuangan & operasional manual, rentan kesalahan    │
│  • Tidak ada media penjualan produk secara online               │
└──────────────────────────────┬──────────────────────────────────┘
                               ↓
┌───────────────────────────────┐ ┌─────────────────────────────────┐
│       LANDASAN TEORI          │ │     PENELITIAN TERDAHULU        │
│ • Sistem Informasi & SIM      │ │ • Rahayu et al. (2021)          │
│ • SI Berbasis Web             │ │ • Santoso & Wibowo (2020)       │
│ • Rekayasa Perangkat Lunak    │ │ • Kurniawan et al. (2022)       │
│ • SDLC Model Waterfall        │ │ • Fitriani & Rahmat (2022)      │
│ • Teknologi: Next.js,         │ │ • Wijaya & Susanto (2023)       │
│   TypeScript, Prisma, SQLite  │ │ • Purnama & Dewi (2023)         │
│ • UML (Use Case, ERD, dll.)   │ │ • Azzahra et al. (2023)         │
│ • Black Box Testing           │ │ • Mahendra & Rai (2022)         │
└───────────────────────────────┘ └─────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SOLUSI YANG DIUSULKAN                         │
├─────────────────────────────────────────────────────────────────┤
│  Rancang Bangun SIM Layanan Perawatan Kucing Berbasis Web       │
│  Teknologi: Next.js • TypeScript • Prisma ORM • SQLite          │
│  NextAuth.js • Cloudinary • Resend • Tailwind CSS               │
└──────────────────────────────┬──────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│             METODE PENGEMBANGAN: SDLC WATERFALL                 │
├───────────────────────┬─────────────────────────────────────────┤
│ 1. Analisis Kebutuhan │ 3. Implementasi (Next.js + Prisma)      │
│ 2. Perancangan Sistem │ 4. Pengujian Black Box Testing          │
│    (Use Case, ERD,    │ 5. Deployment & Penerapan               │
│     Sequence, UI)     │                                         │
└───────────────────────┴─────────────────────────────────────────┘
                               ↓
┌─────────────────────┐           ┌────────────────────────────────┐
│  MODUL PELANGGAN    │           │    MODUL ADMINISTRATOR         │
│ • Booking online    │           │ • Dashboard analitik           │
│ • E-commerce produk │           │ • Manajemen produk & layanan   │
│ • Penitipan kucing  │           │ • Verifikasi pembayaran        │
│ • Lacak pesanan     │           │ • Laporan operasional          │
│ • Blog edukasi      │           │ • Pengaturan website           │
└─────────────────────┘           └────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   HASIL YANG DIHARAPKAN                         │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Operasional Cikal Pet Care lebih efisien dan terorganisir    │
│  ✓ Pelanggan dapat mengakses layanan kapan saja & di mana saja  │
│  ✓ Laporan keuangan & operasional otomatis, akurat, real-time   │
│  ✓ Jangkauan pasar lebih luas melalui platform e-commerce       │
│  ✓ Kualitas pelayanan kepada pelanggan meningkat signifikan     │
└─────────────────────────────────────────────────────────────────┘
```

---
---

# BAB III
# METODOLOGI PENELITIAN

---

## 3.1 Jenis Penelitian

Penelitian ini merupakan penelitian terapan (applied research) dengan metode penelitian dan pengembangan (Research and Development / R&D) yang berfokus pada perancangan dan pembangunan sistem informasi berbasis web. Pendekatan yang digunakan adalah pendekatan kualitatif untuk analisis kebutuhan sistem dan pendekatan kuantitatif untuk pengujian sistem menggunakan Black Box Testing.

Menurut Sugiyono (2019), penelitian dan pengembangan adalah metode penelitian yang digunakan untuk menghasilkan produk tertentu dan menguji keefektifan produk tersebut. Dalam konteks ini, "produk" yang dimaksud adalah sistem informasi manajemen layanan perawatan kucing berbasis web untuk Cikal Pet Care Polewali Mandar.

---

## 3.2 Lokasi dan Waktu Penelitian

### 3.2.1 Lokasi Penelitian

Penelitian ini dilaksanakan di **Cikal Pet Care**, yang berlokasi di Kabupaten Polewali Mandar, Provinsi Sulawesi Barat. Pemilihan lokasi ini didasarkan pada pertimbangan bahwa Cikal Pet Care merupakan salah satu usaha layanan perawatan kucing yang berkembang di wilayah tersebut namun belum memiliki sistem informasi manajemen yang memadai.

### 3.2.2 Waktu Penelitian

Penelitian ini dilaksanakan selama ± 4 bulan (Februari 2026 – Mei 2026) dengan rincian jadwal kegiatan sebagai berikut:

| No | Kegiatan | Feb 2026 | Mar 2026 | Apr 2026 | Mei 2026 |
|----|----------|----------|----------|----------|----------|
| 1 | Studi Literatur & Pengumpulan Data | ████ | | | |
| 2 | Analisis Kebutuhan Sistem | ████ | ██ | | |
| 3 | Perancangan Sistem (Design) | | ████ | | |
| 4 | Implementasi (Coding) | | ██ | ████ | |
| 5 | Pengujian Sistem (Testing) | | | ██ | ██ |
| 6 | Evaluasi & Perbaikan | | | | ████ |
| 7 | Penulisan Laporan | ██ | ██ | ██ | ████ |

---

## 3.3 Metode Pengumpulan Data

Dalam penelitian ini, pengumpulan data dilakukan melalui beberapa teknik, yaitu:

### 3.3.1 Observasi

Observasi dilakukan dengan melakukan pengamatan langsung terhadap proses operasional bisnis di Cikal Pet Care Polewali Mandar. Pengamatan mencakup:
- Proses pencatatan data pelanggan dan kucing.
- Proses penerimaan dan pengelolaan booking layanan.
- Proses pengelolaan stok produk.
- Proses pembuatan laporan harian/bulanan.
- Alur pembayaran yang berlaku.

### 3.3.2 Wawancara

Wawancara dilakukan secara terstruktur (structured interview) dengan narasumber kunci, yaitu:
- **Pemilik Cikal Pet Care**: Untuk mendapatkan gambaran umum bisnis, permasalahan yang dihadapi, dan kebutuhan sistem yang diinginkan.
- **Karyawan/Staff**: Untuk memahami alur kerja operasional sehari-hari dan kebutuhan sistem dari perspektif pengguna internal.

Instrumen wawancara berupa daftar pertanyaan yang telah disiapkan sebelumnya dan dapat dikembangkan (semi-structured) mengikuti alur percakapan.

### 3.3.3 Studi Dokumentasi

Studi dokumentasi dilakukan dengan mengumpulkan dan menganalisis dokumen-dokumen yang berkaitan dengan operasional Cikal Pet Care, meliputi:
- Catatan data pelanggan yang ada.
- Catatan pesanan dan transaksi.
- Daftar layanan dan harga yang berlaku.
- Katalog produk yang dijual.

### 3.3.4 Studi Literatur

Studi literatur dilakukan dengan mengkaji referensi-referensi ilmiah yang relevan, meliputi:
- Buku teks tentang rekayasa perangkat lunak, sistem informasi manajemen, dan basis data.
- Jurnal ilmiah tentang pengembangan sistem informasi berbasis web dan layanan perawatan hewan.
- Dokumentasi resmi teknologi yang digunakan (Next.js, Prisma, TypeScript, dll.).
- Penelitian-penelitian terdahulu yang relevan.

---

## 3.4 Metode Pengembangan Sistem

Metode pengembangan sistem yang digunakan dalam penelitian ini adalah **SDLC (Systems Development Life Cycle) dengan model Waterfall**. Model Waterfall dipilih karena:
1. Kebutuhan sistem telah terdefinisi dengan baik melalui hasil analisis dan wawancara.
2. Cocok untuk proyek dengan ruang lingkup yang jelas dan tidak terlalu besar.
3. Memberikan dokumentasi yang lengkap di setiap tahap pengembangan.
4. Mudah dikelola karena setiap fase memiliki milestone dan deliverable yang jelas (Pressman & Maxim, 2019).

Tahapan pengembangan sistem yang dilakukan adalah:

### 3.4.1 Tahap 1: Requirements Analysis (Analisis Kebutuhan)

Pada tahap ini dilakukan identifikasi dan dokumentasi semua kebutuhan sistem berdasarkan hasil observasi dan wawancara. Kebutuhan dibagi menjadi dua kategori:

**a. Kebutuhan Fungsional**

Kebutuhan fungsional mendeskripsikan apa yang harus dapat dilakukan oleh sistem:

| Kode | Kebutuhan Fungsional | Aktor |
|------|---------------------|-------|
| KF-01 | Sistem menyediakan halaman beranda (homepage) yang menampilkan informasi umum tentang Cikal Pet Care | Pelanggan |
| KF-02 | Sistem menyediakan katalog layanan perawatan kucing yang dapat dilihat oleh pelanggan | Pelanggan |
| KF-03 | Sistem menyediakan formulir booking layanan online | Pelanggan |
| KF-04 | Sistem menyediakan katalog produk untuk dijual secara online | Pelanggan |
| KF-05 | Sistem menyediakan keranjang belanja (shopping cart) | Pelanggan |
| KF-06 | Sistem menyediakan fitur checkout dan pemilihan metode pembayaran | Pelanggan |
| KF-07 | Sistem menyediakan formulir booking paket penitipan kucing | Pelanggan |
| KF-08 | Sistem menyediakan halaman blog/artikel edukasi tentang perawatan kucing | Pelanggan |
| KF-09 | Sistem menyediakan halaman informasi kontak dan cara pembayaran | Pelanggan |
| KF-10 | Sistem menyediakan fitur login untuk administrator | Admin |
| KF-11 | Administrator dapat mengelola (tambah, ubah, hapus, lihat) data produk | Admin |
| KF-12 | Administrator dapat mengelola varian produk | Admin |
| KF-13 | Administrator dapat mengelola data layanan perawatan | Admin |
| KF-14 | Administrator dapat mengelola data booking layanan | Admin |
| KF-15 | Administrator dapat mengelola data pesanan (order) termasuk verifikasi pembayaran | Admin |
| KF-16 | Administrator dapat mengelola data penitipan kucing | Admin |
| KF-17 | Administrator dapat mengelola data pelanggan | Admin |
| KF-18 | Administrator dapat mengelola konten blog dan artikel | Admin |
| KF-19 | Administrator dapat melihat dashboard dengan statistik dan grafik penjualan | Admin |
| KF-20 | Administrator dapat menghasilkan laporan penjualan dan operasional | Admin |
| KF-21 | Sistem mengirimkan notifikasi email otomatis kepada pelanggan saat booking dan pesanan | Sistem |
| KF-22 | Administrator dapat mengelola pengaturan website (informasi perusahaan, sosial media, dll.) | Admin |
| KF-23 | Sistem mendukung upload gambar produk dan layanan ke Cloudinary | Admin |
| KF-24 | Sistem menyediakan manajemen pengguna dengan role (Super Admin, Admin, Staff) | Super Admin |

**b. Kebutuhan Non-Fungsional**

Kebutuhan non-fungsional mendeskripsikan kualitas dan karakteristik sistem:

| Kode | Aspek | Kebutuhan Non-Fungsional |
|------|-------|--------------------------|
| KNF-01 | Performa | Halaman web harus dapat dimuat dalam waktu < 3 detik pada koneksi broadband standar |
| KNF-02 | Keamanan | Password pengguna harus di-hash menggunakan bcrypt sebelum disimpan ke database |
| KNF-03 | Keamanan | Halaman administrasi harus dilindungi autentikasi (tidak dapat diakses tanpa login) |
| KNF-04 | Keamanan | Sistem harus memvalidasi semua input pengguna untuk mencegah SQL Injection dan XSS |
| KNF-05 | Usability | Antarmuka sistem harus responsif (mobile-friendly) dan dapat digunakan di berbagai perangkat |
| KNF-06 | Reliability | Sistem harus memiliki uptime minimal 99% selama jam operasional |
| KNF-07 | Maintainability | Kode program harus terstruktur, terdokumentasi, dan mudah dipelihara |
| KNF-08 | Compatibility | Sistem harus dapat berjalan pada browser modern (Chrome, Firefox, Safari, Edge) |
| KNF-09 | Scalability | Sistem harus dapat menangani minimal 100 pengguna bersamaan tanpa penurunan performa signifikan |
| KNF-10 | Data Integrity | Sistem harus menjaga konsistensi dan integritas data melalui validasi input dan transaksi database |

### 3.4.2 Tahap 2: System Design (Perancangan Sistem)

#### 3.4.2.1 Perancangan Arsitektur Sistem

Sistem dirancang menggunakan arsitektur **full-stack monolith dengan Next.js App Router**. Arsitektur ini memungkinkan frontend (React Server Components + Client Components) dan backend (API Routes) berada dalam satu codebase yang terintegrasi, menyederhanakan deployment dan pemeliharaan.

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                           │
│  Browser (Chrome / Firefox / Safari / Edge)                    │
│  React Components (Server + Client) | Tailwind CSS             │
│  Zustand (State Management) | Toast Notifications               │
└────────────────────────────┬───────────────────────────────────┘
                             │ HTTP/HTTPS
┌────────────────────────────▼───────────────────────────────────┐
│                     APPLICATION LAYER                          │
│  Next.js 16 App Router                                         │
│  ├── Public Pages: /, /layanan, /produk, /booking, /blog, ...  │
│  ├── Admin Pages: /admin/*, /admin/dashboard, ...              │
│  └── API Routes: /api/products, /api/bookings, /api/orders,... │
│                                                                │
│  NextAuth.js v5 (Authentication & Session Management)          │
│  Zod (Input Validation)                                        │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                      SERVICE LAYER                             │
│  ├── productService.ts                                         │
│  ├── serviceService.ts                                         │
│  ├── bookingService.ts                                         │
│  ├── orderService.ts                                           │
│  ├── emailService.ts (Resend API)                              │
│  └── settingsService.ts                                        │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                       DATA LAYER                               │
│  Prisma ORM Client                                             │
│  ├── SQLite Database (better-sqlite3)                          │
│  └── Cloudinary (Media Storage & CDN)                          │
└────────────────────────────────────────────────────────────────┘

External Services:
├── Resend API (Email Notifications)
└── Cloudinary API (Image Upload & Delivery)
```

#### 3.4.2.2 Perancangan Use Case Diagram

**Use Case Diagram – Pelanggan (Public User)**

Aktor: Pelanggan (pengunjung website)

Use Cases:
- UC-01: Melihat Halaman Beranda
- UC-02: Melihat Katalog Layanan
- UC-03: Melakukan Booking Layanan
- UC-04: Melihat Katalog Produk
- UC-05: Menambahkan Produk ke Keranjang
- UC-06: Melakukan Checkout & Pembayaran
- UC-07: Melihat Paket Penitipan
- UC-08: Melakukan Booking Penitipan
- UC-09: Melacak Status Pesanan
- UC-10: Membaca Blog / Artikel
- UC-11: Melihat Informasi Kontak

**Use Case Diagram – Administrator**

Aktor: Administrator (Admin, Super Admin, Staff)

Use Cases:
- UC-12: Login ke Sistem Admin
- UC-13: Melihat Dashboard Analitik
- UC-14: Mengelola Data Produk (CRUD)
- UC-15: Mengelola Varian Produk
- UC-16: Mengelola Data Layanan (CRUD)
- UC-17: Mengelola Booking Layanan
- UC-18: Mengelola Data Pesanan
- UC-19: Verifikasi Pembayaran
- UC-20: Mengelola Penitipan Kucing
- UC-21: Mengelola Paket Penitipan
- UC-22: Mengelola Data Pelanggan
- UC-23: Mengelola Konten Blog
- UC-24: Melihat Laporan Penjualan
- UC-25: Mengatur Konfigurasi Website
- UC-26: Mengelola Pengguna Admin
- UC-27: Logout dari Sistem

#### 3.4.2.3 Perancangan Activity Diagram

**Activity Diagram – Proses Booking Layanan Online**

```
Pelanggan                              Sistem
    │                                    │
    ▼                                    │
Buka Halaman Booking                    │
    │                                    │
    ▼                                    │
Pilih Layanan                           │
    │                                    ▼
    │                          Cek Ketersediaan Jadwal
    │                                    │
    │                          ┌─────────┴──────────┐
    │                      [Tersedia]           [Tidak Tersedia]
    │                          │                    │
    │                          ▼                    ▼
    │                  Tampilkan Slot         Tampilkan Pesan
    │                  Waktu Tersedia        Jadwal Penuh
    ▼                          │
Isi Form Booking                │
(Nama, No HP, Nama Kucing,      │
 Tanggal, Waktu, Catatan)       │
    │                           │
    ▼                           │
Submit Form                     │
    │                           ▼
    │                  Validasi Input
    │                           │
    │                 ┌─────────┴──────────┐
    │             [Valid]              [Tidak Valid]
    │                 │                    │
    │                 ▼                    ▼
    │         Simpan Data Booking   Tampilkan Pesan
    │         ke Database           Error Validasi
    │                 │
    │                 ▼
    │         Kirim Email Konfirmasi
    │         ke Pelanggan (via Resend)
    │                 │
    │                 ▼
    ◀─────── Tampilkan Halaman
             Konfirmasi Booking
```

**Activity Diagram – Proses Pembelian Produk**

```
Pelanggan                              Sistem
    │                                    │
    ▼                                    │
Buka Halaman Produk                     │
    │                                    ▼
    │                          Tampilkan Katalog Produk
    │                          (Nama, Harga, Stok, Gambar)
    ▼                                    │
Pilih Produk & Varian                   │
    │                                    │
    ▼                                    │
Tambahkan ke Keranjang                  │
    │                                    ▼
    │                          Update State Keranjang
    │                          (Zustand Store)
    ▼                                    │
Buka Halaman Checkout                   │
    │                                    │
    ▼                                    │
Isi Data Penerima                       │
(Nama, No HP, Alamat)                   │
    │                                    │
    ▼                                    │
Pilih Metode Pembayaran                 │
(Transfer Bank / QRIS / COD)            │
    │                                    │
    ▼                                    │
Submit Pesanan                          │
    │                                    ▼
    │                          Validasi Data & Stok
    │                                    │
    │                          ┌─────────┴──────────┐
    │                      [Stok OK]           [Stok Habis]
    │                          │                    │
    │                          ▼                    ▼
    │                  Buat Order di DB      Tampilkan Pesan
    │                  Update Stok           Stok Tidak Cukup
    │                  Produk
    │                          │
    │                          ▼
    │                  Kirim Email Konfirmasi
    │                  Pesanan ke Pelanggan
    │                          │
    ◀────────────────────────── │
Lihat Halaman Sukses           │
Pesanan (dengan No. Order)     │
    │                           │
    ▼                           │
Upload Bukti Pembayaran         │
(jika non-COD)                  │
    │                           ▼
    │                  Admin Verifikasi
    │                  Pembayaran
    │                           │
    │                           ▼
    │                  Update Status Order
    │                  → PAID / PROCESSING
    │                           │
    │                           ▼
    ◀─────────────────── Notifikasi Email
                         Status Pesanan
```

**Activity Diagram – Proses Login Administrator**

```
Administrator                          Sistem
    │                                    │
    ▼                                    │
Buka Halaman /admin/login               │
    │                                    ▼
    │                          Cek Status Sesi
    │                                    │
    │                         ┌──────────┴──────────┐
    │                    [Belum Login]          [Sudah Login]
    │                         │                     │
    │                         ▼                     ▼
    │                 Tampilkan Form          Redirect ke
    │                 Login                   /admin/dashboard
    ▼                         │
Input Email & Password         │
    │                          │
    ▼                          │
Submit Form Login              │
    │                          ▼
    │                 Query Database:
    │                 Cari User berdasarkan Email
    │                          │
    │                 ┌────────┴──────────┐
    │             [User Ditemukan]   [User Tidak Ada]
    │                 │                   │
    │                 ▼                   ▼
    │         Verifikasi Password   Tampilkan Pesan
    │         (bcrypt.compare)      "Email atau Password
    │                 │              Salah"
    │         ┌───────┴──────────┐
    │     [Password OK]    [Password Salah]
    │         │                  │
    │         ▼                  ▼
    │  Buat Session JWT    Tampilkan Pesan
    │  (NextAuth)          "Email atau Password
    │         │             Salah"
    │         ▼
    ◀── Redirect ke
        /admin/dashboard
```

#### 3.4.2.4 Perancangan Sequence Diagram

Sequence diagram menggambarkan interaksi antar komponen/objek sistem secara berurutan berdasarkan waktu, menunjukkan bagaimana pesan (message) dikirimkan dan diterima dalam satu skenario penggunaan (Satzinger et al., 2022). Berikut adalah sequence diagram untuk proses-proses utama sistem Cikal Pet Care:

---

**Sequence Diagram 1 – Proses Booking Layanan Online**

```
Pelanggan     Browser/UI      API Route         Service Layer      Database      Email Service
    │               │          /api/bookings      bookingService      (SQLite)      (Resend)
    │               │               │                  │                │               │
    │──[1] GET /booking────────────►│               │                  │                │               │
    │               │──[2] Query layanan aktif──────────────────────────────────────────►│               │
    │               │◄─────────────────────────────────── [3] Return daftar layanan──────│               │
    │◄──[4] Render halaman booking─ │               │                  │                │               │
    │               │               │               │                  │                │               │
    │──[5] Isi form & submit POST ─►│               │                  │                │               │
    │               │──[6] POST /api/bookings ──────►│                  │                │               │
    │               │               │──[7] Validasi input (Zod schema)                  │               │
    │               │               │──[8] bookingService.create(data)──►│               │               │
    │               │               │                  │──[9] INSERT ServiceBooking ────►│               │
    │               │               │                  │◄────────────────── [10] booking saved ─────────│
    │               │               │                  │──[11] INSERT/UPDATE Customer ──►│               │
    │               │               │                  │◄────────────────── [12] customer saved ────────│
    │               │               │◄──── [13] Return { booking, customer } ──────────────────────────-│
    │               │               │──[14] sendBookingConfirmation(email, booking)──────────────────────►│
    │               │               │◄──────────────────────────────────────── [15] Email sent OK ────── │
    │               │◄─ [16] Response 200 { success: true, bookingId } ─────────────────────────────────│
    │◄──[17] Tampilkan halaman konfirmasi booking ──────────────────────────────────────────────────────│
```

---

**Sequence Diagram 2 – Proses Pemesanan Produk (Checkout)**

```
Pelanggan     Browser/UI      API Route          Service Layer      Database      Email Service
    │               │          /api/orders         orderService       (SQLite)      (Resend)
    │               │               │                   │               │               │
    │──[1] Lihat keranjang (Zustand state)                              │               │
    │──[2] Isi form checkout & submit POST ─────────────────────────────────────────────│
    │               │──[3] POST /api/orders ────────────►│              │               │
    │               │               │──[4] Validasi input (Zod schema)  │               │
    │               │               │──[5] Cek stok produk ─────────────────────────────►│
    │               │               │◄──────────────────────────────── [6] Stok tersedia │
    │               │               │──[7] orderService.createOrder(data)──►│            │
    │               │               │                   │──[8] Generate order_number     │
    │               │               │                   │──[9] INSERT Order ─────────────►│
    │               │               │                   │──[10] INSERT OrderItems ───────►│
    │               │               │                   │──[11] Decrement product.stock ─►│
    │               │               │                   │──[12] Upsert Customer ─────────►│
    │               │               │◄─────────────── [13] Return order ─────────────────│
    │               │               │──[14] sendOrderConfirmation(email, order) ──────────────────────────►
    │               │               │◄─────────────────────────────────────────── [15] Email sent OK ──────
    │               │◄──[16] Response 201 { orderId, orderNumber } ──────────────────────────────────────│
    │◄──[17] Tampilkan halaman sukses pesanan ──────────────────────────────────────────────────────────│
```

---

**Sequence Diagram 3 – Proses Verifikasi Pembayaran oleh Admin**

```
Admin         Browser/UI      API Route               Service Layer       Database     Email Service
    │               │     /api/orders/[id]/verify       orderService        (SQLite)     (Resend)
    │               │               │                       │                 │              │
    │──[1] Login ke panel admin ──────────────────────────────────────────────│              │
    │──[2] Buka halaman /admin/orders ──────────────────────────────────────────────────────│
    │               │──[3] GET /api/orders?status=WAITING_VERIFICATION ──────►│              │
    │               │◄──────────────────── [4] Return list orders ────────────│              │
    │◄──[5] Render daftar pesanan ──│               │                         │              │
    │──[6] Klik tombol "Verifikasi Pembayaran" ──────────────────────────────────────────────│
    │               │──[7] PATCH /api/orders/[id]/verify ─►│                  │              │
    │               │               │──[8] Cek session admin (NextAuth)        │              │
    │               │               │──[9] UPDATE Order SET payment_status='PAID', status='PROCESSING' ─►│
    │               │               │──[10] UPDATE Order SET payment_verified_at = NOW() ───►│
    │               │               │──[11] INSERT ActivityLog ─────────────────────────────►│
    │               │               │◄────────────────────────── [12] Update berhasil ────────│
    │               │               │──[13] sendPaymentVerifiedEmail(customer.email, order) ──────────────►
    │               │               │◄──────────────────────────────────────────── [14] Email sent OK ─────
    │               │◄──[15] Response 200 { success: true } ──────────────────────────────────────────────│
    │◄──[16] Tampilkan notifikasi "Pembayaran berhasil diverifikasi" ───────────────────────────────────│
    │◄──[17] Refresh tabel pesanan ─────────────────────────────────────────────────────────────────────│
```

---

**Sequence Diagram 4 – Proses Login Administrator**

```
Admin         Browser/UI      API Route           NextAuth          Database (SQLite)
    │               │       /api/auth/callback     (Credentials)          │
    │               │               │               │                     │
    │──[1] Buka /admin/login ──────►│               │                     │
    │               │──[2] Cek session cookie (NextAuth middleware)        │
    │               │──[3] Session tidak valid, redirect ke /admin/login   │
    │◄──[4] Tampilkan form login ───│               │                     │
    │──[5] Input email & password ─►│               │                     │
    │               │──[6] POST /api/auth/callback/credentials ───────────►│
    │               │               │──[7] credentials.authorize(email, pw)►│
    │               │               │               │──[8] SELECT user WHERE email=? ──►│
    │               │               │               │◄──────────────── [9] User record ─│
    │               │               │               │──[10] bcrypt.compare(pw, hash)    │
    │               │               │               │──[11] Password valid: return user │
    │               │               │──[12] Create JWT session (user id, role) ─────────│
    │               │               │──[13] Set session cookie                           │
    │               │               │──[14] UPDATE last_login ─────────────────────────►│
    │               │◄──[15] Redirect 302 to /admin/dashboard ──────────────────────────│
    │◄──[16] Tampilkan halaman dashboard admin ──────────────────────────────────────────│
```

---

#### 3.4.2.5 Perancangan Entity Relationship Diagram (ERD)

Berikut adalah entitas-entitas utama dan relasinya dalam basis data sistem:

**Entitas dan Atribut Utama:**

**1. User (Pengguna Admin)**
- id (PK), email (UNIQUE), name, password (hashed), role, avatar_url, is_active, last_login, created_at, updated_at

**2. Customer (Pelanggan)**
- id (PK), name, email, phone (UNIQUE), address, city, postal_code, total_orders, total_spent, created_at, updated_at

**3. Product (Produk)**
- id (PK), name, slug (UNIQUE), description, sku (UNIQUE), price, stock, category, image_url, gallery, is_active, featured, low_stock_alert, created_at, updated_at

**4. ProductVariant (Varian Produk)**
- id (PK), product_id (FK → Product), sku (UNIQUE), name, attributes (JSON), price, stock, is_active, created_at, updated_at

**5. ProductReview (Ulasan Produk)**
- id (PK), product_id (FK → Product), customer_name, customer_email, rating, comment, is_approved, created_at, updated_at

**6. Service (Layanan Perawatan)**
- id (PK), name, slug (UNIQUE), description, type, duration, price, image_url, is_active, featured, max_bookings_per_day, created_at, updated_at

**7. ServiceBooking (Booking Layanan)**
- id (PK), service_id (FK → Service), customer_id (FK → Customer), booking_date, booking_time, pet_name, pet_type, notes, status, created_at, updated_at

**8. Order (Pesanan)**
- id (PK), order_number (UNIQUE), customer_id (FK → Customer), subtotal, shipping_cost, discount_amount, total_amount, payment_method, payment_status, payment_proof_url, shipping_address, shipping_city, shipping_postal, tracking_number, status, notes, admin_notes, paid_at, shipped_at, completed_at, canceled_at, created_at, updated_at

**9. OrderItem (Item Pesanan)**
- id (PK), order_id (FK → Order), product_id (FK → Product), variant_id (FK → ProductVariant), service_id (FK → Service), name, sku, quantity, price, subtotal, created_at

**10. PenitipanPackage (Paket Penitipan)**
- id (PK), name, slug (UNIQUE), description, price_per_night, features (JSON), max_cats, image_url, is_active, created_at, updated_at

**11. PenitipanBooking (Booking Penitipan)**
- id (PK), package_id (FK → PenitipanPackage), customer_id (FK → Customer), check_in_date, check_out_date, total_nights, total_price, number_of_cats, cat_names, special_notes, status, payment_status, payment_proof_url, created_at, updated_at

**12. Blog (Artikel Blog)**
- id (PK), title, slug (UNIQUE), content, excerpt, thumbnail_url, author, category, tags, status, views, meta_title, meta_description, published_at, created_at, updated_at

**13. SiteSettings (Pengaturan Website)**
- id (PK), key (UNIQUE), value, category, label, description, updated_at

**14. ActivityLog (Log Aktivitas)**
- id (PK), user_id (FK → User), order_id (FK → Order), action, entity_type, entity_id, description, metadata, created_at

**Relasi Antar Entitas:**

| Entitas 1 | Relasi | Entitas 2 | Keterangan |
|-----------|--------|-----------|------------|
| Product | 1 : N | ProductVariant | Satu produk memiliki banyak varian |
| Product | 1 : N | ProductReview | Satu produk memiliki banyak ulasan |
| Product | 1 : N | OrderItem | Satu produk dapat ada di banyak item pesanan |
| ProductVariant | 1 : N | OrderItem | Satu varian dapat ada di banyak item pesanan |
| Service | 1 : N | ServiceBooking | Satu layanan dapat dibooking berkali-kali |
| Service | 1 : N | OrderItem | Satu layanan dapat ada di banyak item pesanan |
| Customer | 1 : N | Order | Satu pelanggan dapat memiliki banyak pesanan |
| Customer | 1 : N | ServiceBooking | Satu pelanggan dapat membuat banyak booking |
| Customer | 1 : N | PenitipanBooking | Satu pelanggan dapat membuat banyak booking penitipan |
| Order | 1 : N | OrderItem | Satu pesanan memiliki banyak item |
| Order | 1 : N | ActivityLog | Satu pesanan dapat memiliki banyak log aktivitas |
| PenitipanPackage | 1 : N | PenitipanBooking | Satu paket penitipan dapat dibooking berkali-kali |
| User | 1 : N | ActivityLog | Satu pengguna admin dapat menghasilkan banyak log |

#### 3.4.2.6 Perancangan Struktur Database

Berikut adalah struktur tabel-tabel utama yang akan diimplementasikan dalam database SQLite menggunakan Prisma ORM:

**Tabel: products**

| Nama Kolom | Tipe Data | Keterangan |
|------------|-----------|------------|
| id | TEXT (UUID) | Primary Key |
| name | TEXT | Nama produk |
| slug | TEXT | Slug URL unik |
| description | TEXT | Deskripsi produk |
| sku | TEXT | Kode SKU unik |
| price | REAL | Harga produk |
| stock | INTEGER | Jumlah stok |
| category | TEXT | Kategori produk |
| image_url | TEXT | URL gambar utama |
| gallery | TEXT | JSON array URL gambar tambahan |
| is_active | BOOLEAN | Status aktif produk |
| featured | BOOLEAN | Produk unggulan |
| low_stock_alert | INTEGER | Batas stok rendah |
| created_at | DATETIME | Waktu dibuat |
| updated_at | DATETIME | Waktu diperbarui |

**Tabel: service_bookings**

| Nama Kolom | Tipe Data | Keterangan |
|------------|-----------|------------|
| id | TEXT (UUID) | Primary Key |
| service_id | TEXT | FK → services.id |
| customer_id | TEXT | FK → customers.id |
| booking_date | DATETIME | Tanggal booking |
| booking_time | TEXT | Jam booking |
| pet_name | TEXT | Nama kucing |
| pet_type | TEXT | Jenis kucing |
| notes | TEXT | Catatan tambahan |
| status | TEXT | Status: PENDING, CONFIRMED, COMPLETED, dll. |
| created_at | DATETIME | Waktu dibuat |
| updated_at | DATETIME | Waktu diperbarui |

**Tabel: orders**

| Nama Kolom | Tipe Data | Keterangan |
|------------|-----------|------------|
| id | TEXT (UUID) | Primary Key |
| order_number | TEXT | Nomor pesanan unik |
| customer_id | TEXT | FK → customers.id |
| subtotal | REAL | Subtotal sebelum ongkir & diskon |
| shipping_cost | REAL | Biaya pengiriman |
| discount_amount | REAL | Jumlah diskon |
| total_amount | REAL | Total yang harus dibayar |
| payment_method | TEXT | Metode pembayaran |
| payment_status | TEXT | Status pembayaran |
| payment_proof_url | TEXT | URL bukti transfer |
| status | TEXT | Status pesanan |
| created_at | DATETIME | Waktu dibuat |
| updated_at | DATETIME | Waktu diperbarui |

#### 3.4.2.7 Perancangan Antarmuka (UI/UX Design)

**a. Halaman Publik (Public Pages)**

Antarmuka halaman publik dirancang dengan prinsip:
- **Clean & Professional**: Desain minimalis dengan warna utama biru (#2563EB) yang merepresentasikan kepercayaan dan profesionalisme.
- **Mobile-First**: Dirancang terlebih dahulu untuk tampilan mobile kemudian dikembangkan ke tampilan desktop.
- **Informative**: Menampilkan informasi layanan dan produk dengan jelas dan menarik.
- **Call-to-Action yang jelas**: Tombol booking dan pembelian yang menonjol dan mudah ditemukan.

Halaman-halaman publik yang dirancang:
1. **Halaman Beranda (/)**: Hero section, statistik layanan, daftar layanan unggulan, produk featured, testimoni pelanggan, blog terbaru, dan peta lokasi.
2. **Halaman Layanan (/layanan)**: Grid kartu layanan dengan detail harga, durasi, dan tombol booking.
3. **Halaman Booking (/booking)**: Form booking dengan validasi real-time, pemilihan layanan, tanggal, dan waktu.
4. **Halaman Produk (/produk)**: Grid produk dengan filter kategori, pencarian, dan keranjang belanja.
5. **Halaman Checkout (/checkout)**: Form data pengiriman, ringkasan pesanan, dan pemilihan pembayaran.
6. **Halaman Blog (/blog)**: Grid artikel dengan filter kategori dan fungsi pencarian.
7. **Halaman Penitipan**: Daftar paket penitipan dengan detail fitur dan form booking.
8. **Halaman Pesanan (/pesanan)**: Pelacakan status pesanan berdasarkan nomor pesanan.
9. **Halaman Kontak (/kontak)**: Informasi kontak, peta, dan form pertanyaan.

**b. Halaman Admin (Admin Pages)**

Panel administrasi menggunakan sidebar navigation dengan komponen:
- **Sidebar** (kiri): Menu navigasi antar modul admin.
- **Header** (atas): Informasi pengguna yang login, notifikasi, dan tombol logout.
- **Main Content** (kanan): Konten utama sesuai modul yang dipilih.

Halaman-halaman admin yang dirancang:
1. **Dashboard (/admin)**: Statistik ringkasan (total pendapatan, total pesanan, produk aktif, jumlah layanan), grafik pendapatan enam bulan terakhir (Bar Chart), grafik distribusi status pesanan (Pie Chart), kartu ringkasan status pesanan (selesai/diproses/menunggu/dibatalkan), dan tabel pesanan terbaru.
2. **Manajemen Produk (/admin/products)**: Tabel produk dengan fitur pencarian, filter, dan pagination; form tambah/edit produk.
3. **Manajemen Layanan (/admin/services)**: Tabel layanan dengan CRUD; form tambah/edit layanan.
4. **Manajemen Booking (/admin/bookings)**: Tabel booking dengan filter status; form konfirmasi booking.
5. **Manajemen Pesanan (/admin/orders)**: Tabel pesanan dengan filter status dan pembayaran; detail pesanan; form verifikasi pembayaran.
6. **Manajemen Penitipan (/admin/penitipan)**: Tabel booking penitipan; form pengelolaan paket dan booking.
7. **Manajemen Blog (/admin/blog)**: Editor artikel dengan preview.
8. **Laporan (/admin/laporan)**: Grafik dan tabel laporan penjualan, booking, dan pendapatan.
9. **Pengaturan (/admin/settings)**: Form pengaturan informasi perusahaan, sosial media, payment info.

### 3.4.3 Tahap 3: Implementation (Implementasi)

Pada tahap implementasi, rancangan sistem yang telah dibuat diwujudkan dalam bentuk kode program menggunakan teknologi-teknologi yang telah ditetapkan. Implementasi dilakukan mengikuti struktur folder Next.js App Router dengan konvensi yang telah ditetapkan.

**Struktur Folder Proyek:**

```
cikal-pet-care/
├── app/
│   ├── globals.css          # Global styles + Tailwind directives
│   ├── layout.tsx           # Root layout (HTML, body, providers)
│   ├── page.tsx             # Halaman beranda
│   ├── not-found.tsx        # Halaman 404
│   ├── (public)/            # Group route untuk halaman publik
│   │   ├── booking/         # Halaman booking layanan
│   │   ├── produk/          # Katalog produk
│   │   ├── layanan/         # Katalog layanan
│   │   ├── blog/            # Halaman blog
│   │   ├── checkout/        # Halaman checkout
│   │   ├── pesanan/         # Pelacakan pesanan
│   │   └── kontak/          # Halaman kontak
│   ├── admin/               # Halaman administrasi (protected)
│   │   ├── layout.tsx       # Admin layout (sidebar + header)
│   │   ├── page.tsx         # Dashboard admin
│   │   ├── products/        # CRUD produk
│   │   ├── services/        # CRUD layanan
│   │   ├── bookings/        # Manajemen booking
│   │   ├── orders/          # Manajemen pesanan
│   │   ├── penitipan/       # Manajemen penitipan
│   │   ├── blog/            # Manajemen blog
│   │   ├── laporan/         # Laporan
│   │   └── settings/        # Pengaturan website
│   └── api/                 # Backend API Routes
│       ├── auth/            # NextAuth endpoints
│       ├── products/        # API produk
│       ├── services/        # API layanan
│       ├── bookings/        # API booking
│       ├── orders/          # API pesanan
│       ├── packages/        # API paket penitipan
│       ├── settings/        # API pengaturan
│       └── upload/          # API upload Cloudinary
├── src/
│   ├── auth.ts              # Konfigurasi NextAuth
│   ├── components/          # Komponen UI reusable
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── Cart.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── prisma.ts        # Prisma Client instance
│   │   └── utils.ts         # Fungsi utilitas
│   ├── services/            # Business logic layer
│   │   ├── productService.ts
│   │   ├── bookingService.ts
│   │   ├── orderService.ts
│   │   ├── emailService.ts
│   │   └── settingsService.ts
│   ├── store/
│   │   └── cartStore.ts     # Zustand cart state
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
├── middleware.ts            # NextAuth middleware (route protection)
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies
```

**Implementasi Layanan Email (emailService.ts):**

Layanan email diimplementasikan menggunakan Resend API untuk mengirimkan notifikasi otomatis kepada pelanggan pada event-event berikut:
- Konfirmasi booking layanan baru (status: PENDING)
- Konfirmasi booking penitipan kucing
- Konfirmasi pesanan baru (status: PENDING)
- Notifikasi pembayaran telah diverifikasi (status: PAID)
- Notifikasi pesanan dalam proses (status: PROCESSING)
- Notifikasi pesanan selesai (status: COMPLETED)

**Implementasi Keamanan Sistem:**

1. **Autentikasi**: NextAuth.js v5 dengan Credentials Provider dan JWT session.
2. **Otorisasi**: Middleware Next.js mengecek session dan role sebelum mengizinkan akses ke halaman admin.
3. **Password Hashing**: Bcryptjs dengan salt round 12 untuk hashing password administrator.
4. **Input Validation**: Zod schema validation di setiap endpoint API untuk mencegah data yang tidak valid masuk ke database.
5. **Prisma ORM**: Penggunaan parameterized queries otomatis oleh Prisma mencegah SQL Injection.
6. **HTTPS**: Semua komunikasi menggunakan protokol HTTPS saat deployment.

### 3.4.4 Tahap 4: Testing (Pengujian Sistem)

Pengujian sistem dilakukan menggunakan metode **Black Box Testing** yang berfokus pada pengujian fungsionalitas eksternal sistem. Pengujian dilakukan secara sistematis berdasarkan kebutuhan fungsional yang telah ditetapkan.

**Kriteria Penerimaan Pengujian:**
- **Berhasil (✓)**: Output sistem sesuai dengan output yang diharapkan.
- **Tidak Berhasil (✗)**: Output sistem tidak sesuai dengan output yang diharapkan dan perlu perbaikan.

**Rencana Pengujian (Test Cases):**

| No | Modul | Skenario Pengujian | Input | Output yang Diharapkan |
|----|-------|-------------------|-------|------------------------|
| TC-01 | Login Admin | Login dengan kredensial valid | Email & password benar | Redirect ke /admin/dashboard |
| TC-02 | Login Admin | Login dengan password salah | Email benar, password salah | Pesan error "Email atau password salah" |
| TC-03 | Login Admin | Login dengan email tidak terdaftar | Email tidak terdaftar | Pesan error "Email atau password salah" |
| TC-04 | Login Admin | Akses halaman admin tanpa login | - | Redirect ke /admin/login |
| TC-05 | Produk | Tambah produk baru dengan data lengkap | Data produk valid | Produk tersimpan dan muncul di tabel |
| TC-06 | Produk | Tambah produk dengan SKU duplikat | SKU yang sudah ada | Pesan error "SKU sudah digunakan" |
| TC-07 | Produk | Edit data produk yang ada | Data produk diubah | Data produk ter-update di database |
| TC-08 | Produk | Hapus produk | Produk yang dipilih | Produk terhapus dari database |
| TC-09 | Booking | Booking layanan dengan data lengkap | Form booking diisi lengkap | Booking tersimpan, email konfirmasi terkirim |
| TC-10 | Booking | Booking dengan input tanggal yang sudah lewat | Tanggal masa lalu | Pesan error validasi tanggal |
| TC-11 | Pesanan | Buat pesanan dengan produk valid | Data checkout lengkap | Pesanan tersimpan, email konfirmasi terkirim |
| TC-12 | Pesanan | Upload bukti pembayaran | File gambar | Gambar ter-upload ke Cloudinary |
| TC-13 | Pesanan | Verifikasi pembayaran oleh admin | Admin konfirmasi pembayaran | Status pesanan berubah ke PAID, email terkirim |
| TC-14 | Dashboard | Lihat halaman dashboard | Admin login | Statistik dan grafik tampil dengan benar |
| TC-15 | Laporan | Generate laporan penjualan | Pilih periode | Laporan tampil dengan data yang akurat |
| TC-16 | Penitipan | Booking paket penitipan | Form penitipan diisi | Booking tersimpan, konfirmasi tampil |
| TC-17 | Blog | Tambah artikel blog | Konten artikel | Artikel tersimpan dan dapat dilihat di frontend |
| TC-18 | Pengaturan | Ubah informasi kontak | Data kontak baru | Pengaturan ter-update |
| TC-19 | Keranjang | Tambah produk ke keranjang | Produk dan jumlah | Item muncul di keranjang, total dihitung benar |
| TC-20 | Keranjang | Checkout dengan keranjang kosong | Keranjang kosong | Pesan "Keranjang belanja kosong" |

### 3.4.5 Tahap 5: Deployment (Penerapan)

Pada tahap ini, sistem yang telah diuji dan dinyatakan layak akan diterapkan pada lingkungan produksi. Tahapan deployment meliputi:

1. **Persiapan Server/Hosting**: Konfigurasi lingkungan hosting (VPS atau platform cloud).
2. **Konfigurasi Environment Variables**: Pengaturan variabel lingkungan yang berisi kredensial database, API key Cloudinary, API key Resend, dan secret NextAuth.
3. **Migrasi Database**: Menjalankan Prisma migrate untuk membuat tabel-tabel database di server produksi.
4. **Build Aplikasi**: Menjalankan `next build` untuk mengoptimalkan kode aplikasi.
5. **Seeding Data Awal**: Mengisi data awal (admin pertama, layanan default, dll.) menggunakan Prisma seed.
6. **Konfigurasi Domain**: Pengaturan domain dan SSL/HTTPS certificate.
7. **Pelatihan Pengguna**: Pelatihan kepada administrator dan staff Cikal Pet Care dalam menggunakan sistem.

---

## 3.5 Definisi Operasional

Untuk menyamakan persepsi dan menghindari kesalahan penafsiran terhadap variabel dan konsep yang digunakan dalam penelitian ini, berikut disajikan definisi operasional dari istilah-istilah kunci yang digunakan:

| No | Istilah | Definisi Operasional dalam Konteks Penelitian Ini |
|----|---------|---------------------------------------------------|
| 1 | **Sistem Informasi Manajemen (SIM)** | Aplikasi web berbasis Next.js yang dibangun khusus untuk mengelola seluruh proses operasional bisnis Cikal Pet Care, meliputi modul produk, layanan, booking, penitipan, pesanan, pelanggan, laporan, blog, dan pengaturan website |
| 2 | **Layanan Perawatan Kucing** | Jasa yang disediakan oleh Cikal Pet Care meliputi grooming (mandi, potong bulu, potong kuku), konsultasi kesehatan, vaksinasi, dan layanan lain yang terdaftar pada tabel `services` dalam database |
| 3 | **Booking Layanan** | Proses pemesanan jadwal layanan perawatan oleh pelanggan melalui formulir online pada halaman /booking, yang menghasilkan record baru pada tabel `service_bookings` dengan status awal PENDING |
| 4 | **Penitipan Kucing (Cat Boarding)** | Layanan akomodasi sementara untuk kucing yang dikelola melalui modul penitipan, di mana pelanggan memilih paket penitipan, tanggal check-in dan check-out, yang tersimpan dalam tabel `penitipan_bookings` |
| 5 | **Pesanan (Order)** | Transaksi pembelian produk oleh pelanggan melalui fitur e-commerce website, yang mencakup proses tambah ke keranjang, checkout, dan pembayaran, tersimpan dalam tabel `orders` dan `order_items` |
| 6 | **Verifikasi Pembayaran** | Proses konfirmasi pembayaran yang dilakukan oleh administrator setelah pelanggan mengunggah bukti transfer, yang mengubah `payment_status` pesanan dari VERIFYING menjadi PAID |
| 7 | **Administrator** | Pengguna yang memiliki akun login di panel admin (`/admin/*`) dengan role SUPER_ADMIN, ADMIN, atau STAFF, tersimpan dalam tabel `users`, dan memiliki akses untuk mengelola seluruh atau sebagian data sistem |
| 8 | **Pelanggan (Customer)** | Pengguna yang menggunakan layanan atau membeli produk Cikal Pet Care tanpa akun login; data pelanggan dikumpulkan melalui form booking/checkout dan tersimpan dalam tabel `customers`, diidentifikasi unik berdasarkan nomor telepon |
| 9 | **Dashboard Analitik** | Halaman `/admin` yang menampilkan ringkasan statistik bisnis (total produk, booking hari ini, pesanan pending, pendapatan bulan ini) beserta grafik tren menggunakan Recharts, yang di-generate dari query database secara real-time |
| 10 | **Notifikasi Email Otomatis** | Pesan elektronik yang dikirimkan secara otomatis oleh sistem kepada pelanggan melalui Resend API pada event tertentu (booking baru, pesanan terkonfirmasi, pembayaran terverifikasi, dll.) tanpa intervensi manual administrator |
| 11 | **Grooming** | Layanan perawatan fisik kucing yang mencakup mandi, pengeringan, penyisiran bulu, trimming, potong kuku, dan pembersihan telinga/mata, yang terdaftar sebagai salah satu jenis layanan (field `type` pada tabel `services`) |
| 12 | **Paket Penitipan** | Pilihan layanan penitipan dengan fasilitas dan harga per malam yang berbeda-beda, dikelola dalam tabel `penitipan_packages`, dan dapat dikonfigurasi oleh administrator melalui panel admin |
| 13 | **Black Box Testing** | Metode pengujian yang digunakan dalam penelitian ini untuk memverifikasi fungsionalitas sistem dengan memberikan input tertentu dan membandingkan output aktual dengan output yang diharapkan, tanpa melihat kode internal program |
| 14 | **Slug** | String URL-friendly yang unik untuk setiap produk, layanan, dan artikel blog (contoh: "paket-grooming-premium"), digunakan sebagai identifier pada URL halaman publik dan tersimpan dalam kolom `slug` pada masing-masing tabel |
| 15 | **SKU (Stock Keeping Unit)** | Kode unik yang mengidentifikasi setiap produk atau varian produk dalam sistem inventori, digunakan untuk pelacakan stok dan pencatatan pesanan, tersimpan dalam kolom `sku` pada tabel `products` dan `product_variants` |

---

## 3.6 Alat dan Bahan Penelitian

### 3.6.1 Perangkat Keras (Hardware)

Perangkat keras yang digunakan dalam penelitian ini adalah:

| Komponen | Spesifikasi |
|----------|-------------|
| Laptop/PC | Prosesor Intel Core i5/i7 atau AMD Ryzen 5/7 (minimum) |
| RAM | 8 GB (minimum), 16 GB (disarankan) |
| Storage | SSD 256 GB (minimum) |
| Koneksi Internet | Broadband minimum 10 Mbps |

### 3.6.2 Perangkat Lunak (Software)

Perangkat lunak yang digunakan dalam penelitian ini adalah:

| Perangkat Lunak | Versi | Fungsi |
|----------------|-------|--------|
| Node.js | v18.x / v20.x | Runtime JavaScript server-side |
| Next.js | v16.1.6 | Framework web full-stack |
| React | v18.3.1 | Library UI |
| TypeScript | v5.x | Bahasa pemrograman |
| Prisma ORM | v5.22.0 | Database ORM |
| SQLite (better-sqlite3) | v12.6.2 | Database |
| Tailwind CSS | v3.x | CSS Framework |
| NextAuth.js | v5.0.0-beta | Autentikasi |
| Cloudinary | v2.9.0 | Cloud media storage |
| Resend | v6.9.2 | Email service |
| Zustand | v5.0.11 | State management |
| Recharts | v3.8.1 | Data visualization |
| Zod | v4.3.6 | Schema validation |
| Bcryptjs | v3.0.3 | Password hashing |
| VS Code | Terbaru | Code editor |
| Git | Terbaru | Version control |
| Postman | Terbaru | API testing |
| Figma | Berbasis web | UI/UX design |

---

## 3.7 Diagram Alir Penelitian (Flowchart Penelitian)

Diagram alir berikut menggambarkan tahapan-tahapan penelitian secara sistematis. Simbol persegi panjang menyatakan proses, simbol belah ketupat (◇) menyatakan keputusan, dan simbol oval menyatakan terminal (mulai/selesai).

```
                    ●  MULAI
                       ↓
    ┌──────────────────────────────────────────────────┐
    │          1. IDENTIFIKASI MASALAH                 │
    │  Observasi langsung & wawancara di Cikal         │
    │  Pet Care → Dokumentasi permasalahan             │
    └──────────────────────────────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────────┐
    │     2. STUDI LITERATUR & PENGUMPULAN DATA        │
    │  • Kajian buku teks (SI, rekayasa PL, BD)        │
    │  • Kajian jurnal & penelitian terdahulu          │
    │  • Kajian dokumentasi teknologi (Next.js, dll.)  │
    │  • Studi dokumentasi operasional Cikal Pet Care  │
    └──────────────────────────────────────────────────┘
                       ↓
    ◇  APAKAH DATA YANG TERKUMPUL SUDAH CUKUP?
       TIDAK ──────────────────────────────────┐
       ↓ YA                                    │ (kembali ke atas)
    ┌──────────────────────────────────────────────────┐
    │       3. ANALISIS KEBUTUHAN SISTEM               │
    │  • Kebutuhan Fungsional (KF-01 s.d. KF-24)      │
    │  • Kebutuhan Non-Fungsional (KNF-01 s.d. KNF-10)│
    │  • Penetapan ruang lingkup & batasan sistem      │
    └──────────────────────────────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────────┐
    │         4. PERANCANGAN SISTEM                    │
    │  • Arsitektur sistem (Next.js App Router)        │
    │  • Use Case Diagram (pelanggan & admin)          │
    │  • Activity Diagram (booking, pesanan, login)    │
    │  • Sequence Diagram (4 proses utama)             │
    │  • Entity Relationship Diagram (14 entitas)      │
    │  • Struktur database (Prisma schema)             │
    │  • Perancangan antarmuka UI/UX                   │
    └──────────────────────────────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────────┐
    │          5. IMPLEMENTASI / CODING                │
    │  • Backend: Next.js API Routes + Prisma + SQLite │
    │  • Frontend: React Server Components + Tailwind  │
    │  • Autentikasi: NextAuth.js v5 (JWT)             │
    │  • Media: Cloudinary | Email: Resend API         │
    │  • State: Zustand | Validasi: Zod                │
    └──────────────────────────────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────────┐
    │        6. PENGUJIAN: BLACK BOX TESTING           │
    │  20 skenario — Login, Produk, Booking, Pesanan,  │
    │  Penitipan, Dashboard, Laporan, Blog, Keranjang  │
    └──────────────────────────────────────────────────┘
                       ↓
    ◇  APAKAH SISTEM LOLOS SEMUA SKENARIO PENGUJIAN?
       TIDAK ──────────────────────────────────────────┐
       ↓ YA                              (kembali ke Implementasi)
    ┌──────────────────────────────────────────────────┐
    │        7. DEPLOYMENT & PENERAPAN SISTEM          │
    │  • Konfigurasi server & environment variables    │
    │  • Migrasi database (prisma migrate deploy)      │
    │  • Build (next build) & seeding data awal        │
    │  • Konfigurasi domain & SSL/HTTPS                │
    │  • Pelatihan pengguna (admin & staff)            │
    └──────────────────────────────────────────────────┘
                       ↓
    ┌──────────────────────────────────────────────────┐
    │       8. PENULISAN LAPORAN SKRIPSI               │
    │  • Dokumentasi seluruh tahapan penelitian        │
    │  • Analisis & pembahasan hasil                   │
    │  • Penarikan kesimpulan dan saran                │
    └──────────────────────────────────────────────────┘
                       ↓
                    ●  SELESAI
```

---
---

# DAFTAR PUSTAKA

---

Ammann, P., & Offutt, J. (2022). *Introduction to Software Testing* (2nd ed.). Cambridge University Press.

American Association of Feline Practitioners (AAFP). (2021). *Feline Grooming and Coat Care Guidelines*. American Association of Feline Practitioners. https://catvets.com/guidelines/practice-guidelines

American Pet Products Association (APPA). (2023). *2023-2024 APPA National Pet Owners Survey*. Greenwich: American Pet Products Association.

Auth.js. (2024). *Auth.js Documentation - Authentication for the web*. https://authjs.dev/

Azzahra, F., Nurhidayat, M., & Ramadhan, A. (2023). Penerapan sistem e-commerce pada UMKM perlengkapan hewan peliharaan menggunakan ReactJS. *Jurnal Informatika dan Rekayasa Perangkat Lunak*, *5*(2), 112–124.

better-sqlite3. (2024). *better-sqlite3: Documentation and API Reference*. https://github.com/WiseLibs/better-sqlite3

Campbell, R. (2021). *Pet Boarding and Grooming Industry: Market Analysis and Best Practices*. Pet Industry Joint Advisory Council (PIJAC).

Cloudinary. (2024). *Cloudinary Documentation: Image and Video Management Platform*. https://cloudinary.com/documentation

Colinhacks. (2024). *Zod Documentation: TypeScript-first Schema Validation*. https://zod.dev/

Dennis, A., Wixom, B. H., & Tegarden, D. (2021). *Systems Analysis and Design: An Object-Oriented Approach with UML* (6th ed.). John Wiley & Sons.

Drangies, D. (2024). *bcryptjs: Optimized bcrypt in JavaScript*. https://github.com/dcodeIO/bcrypt.js

Elmasri, R., & Navathe, S. B. (2023). *Fundamentals of Database Systems* (8th ed.). Pearson Education.

Evergreen, S. D. H. (2022). *Effective Data Visualization: The Right Chart for the Right Data* (3rd ed.). SAGE Publications.

Fitriani, S., & Rahmat, A. (2022). Analisis pengembangan bisnis perawatan kucing di Indonesia: Peluang dan tantangan di era digital. *Jurnal Manajemen dan Bisnis Indonesia*, *10*(1), 45–62.

Gaur, A., & Sharma, R. (2022). Online appointment booking systems: A review of design principles and user experience factors. *International Journal of Computer Applications*, *184*(15), 1–8.

Hipp, R. D. (2024). *SQLite Home Page: Small. Fast. Reliable. Choose any three*. https://www.sqlite.org/

International Boarding & Pet Services Association (IBPSA). (2022). *Standards of Care for Pet Boarding Facilities*. International Boarding & Pet Services Association.

Kadir, A. (2020). *Pengantar Sistem Informasi* (Edisi Revisi). ANDI Offset.

Kurniawan, R., Pratiwi, M., & Hidayat, T. (2022). Pengembangan sistem informasi pet boarding berbasis web dengan pendekatan prototyping. *Jurnal Teknologi dan Sistem Informasi*, *3*(2), 98–114.

Laudon, K. C., & Laudon, J. P. (2020). *Management Information Systems: Managing the Digital Firm* (16th ed.). Pearson Education.

Mahendra, I. G. B., & Rai, I. G. A. (2022). Perancangan sistem informasi veteriner berbasis web dengan fitur notifikasi email otomatis. *Jurnal TEKNOIF Teknik Informatika*, *10*(2), 78–89.

Meta Open Source. (2024). *React Documentation: The library for web and native user interfaces*. https://react.dev/

Microsoft. (2024). *TypeScript Documentation: JavaScript With Syntax For Types*. https://www.typescriptlang.org/docs/

Next.js Documentation. (2024). *Next.js by Vercel - The React Framework*. https://nextjs.org/docs

OWASP. (2024). *Password Storage Cheat Sheet*. Open Web Application Security Project. https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

Pmndrs. (2024). *Zustand Documentation: A small, fast and scalable bearbones state-management solution*. https://zustand-demo.pmnd.rs/

Populix. (2023). *Tren Kepemilikan Hewan Peliharaan di Indonesia 2023*. Populix Research. https://populix.co/articles/tren-hewan-peliharaan-indonesia

Pressman, R. S., & Maxim, B. R. (2019). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education.

Prisma. (2024). *Prisma Documentation: Next-generation Node.js and TypeScript ORM*. https://www.prisma.io/docs

Purnama, R., & Dewi, L. A. (2023). Sistem informasi penjualan dan penitipan hewan peliharaan berbasis web (Studi kasus: Rumah Anabul Yogyakarta). *Jurnal Informatika: Jurnal Pengembangan IT (JPIT)*, *8*(1), 34–43.

Rahayu, D., Sari, R. P., & Nugroho, A. (2021). Sistem informasi manajemen pet shop berbasis web menggunakan framework Laravel. *Jurnal Pengembangan Teknologi Informasi dan Ilmu Komputer (J-PTIIK)*, *5*(7), 3210–3220.

Rainer, R. K., & Prince, B. (2023). *Introduction to Information Systems* (9th ed.). John Wiley & Sons.

Recharts. (2024). *Recharts Documentation: Redefined chart library built with React and D3*. https://recharts.org/

Resend. (2024). *Resend Documentation: Email for developers*. https://resend.com/docs

Santoso, B., & Wibowo, A. H. (2020). Rancang bangun sistem informasi klinik veteriner berbasis web untuk meningkatkan kualitas pelayanan. *Seminar Nasional Teknologi Informasi dan Komunikasi (SENTIKA)*, *2020*(1), 45–54.

Satzinger, J. W., Jackson, R. B., & Burd, S. D. (2022). *Systems Analysis and Design in a Changing World* (8th ed.). Cengage Learning.

Schlueter, C., & Grandin, T. (2019). *Feline Behavioral Health and Welfare*. Iowa State University Press.

Sommerville, I. (2021). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson Education.

Sugiyono. (2019). *Metode Penelitian Kuantitatif, Kualitatif, dan R&D* (Edisi ke-2). Alfabeta.

Tailwind Labs. (2024). *Tailwind CSS Documentation: A utility-first CSS framework*. https://tailwindcss.com/docs

Turban, E., Pollard, C., & Wood, G. (2021). *Information Technology for Management: On-Demand Strategies for Performance, Growth and Sustainability* (12th ed.). John Wiley & Sons.

TypeScript Documentation. (2024). *TypeScript Handbook*. https://www.typescriptlang.org/docs/handbook/intro.html

Vercel. (2024). *Next.js Documentation: The React Framework for Production*. https://nextjs.org

Wijaya, H., & Susanto, E. (2023). Implementasi Next.js dan Prisma ORM dalam pengembangan sistem informasi manajemen berbasis web: Studi perbandingan performa. *Jurnal Sistem Informasi dan Teknik Komputer (JOSISTKOM)*, *7*(2), 156–170.

Zustand Documentation. (2024). *Zustand: Bear necessities for state management in React*. https://github.com/pmndrs/zustand

---

> **Catatan Penulisan**: Skripsi ini disusun berdasarkan studi kasus nyata pada Cikal Pet Care Polewali Mandar dengan mengacu pada standar penulisan karya ilmiah. Format daftar pustaka menggunakan gaya **APA (American Psychological Association) Edisi ke-7**. Seluruh referensi jurnal dapat diverifikasi melalui portal Google Scholar (https://scholar.google.com) atau portal Garuda Ristekbrin (https://garuda.kemdikbud.go.id) untuk jurnal nasional Indonesia.
