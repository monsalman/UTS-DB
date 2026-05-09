# GlowPOS - Point of Sale System

GlowPOS adalah sistem manajemen Point of Sale (POS) modern yang dibangun menggunakan Next.js. Proyek ini dirancang untuk memfasilitasi transaksi penjualan, manajemen inventaris, dan antarmuka pelanggan yang responsif.

## Deskripsi Proyek
Proyek ini memiliki dua komponen utama:
- **Admin Dashboard**: Digunakan oleh pemilik toko atau staf untuk mengelola produk, melihat riwayat transaksi, dan mengatur operasional toko.
- **Customer Interface**: Antarmuka pelanggan untuk melakukan pemesanan (self-ordering) dengan dukungan pembayaran QRIS.

## Fitur Utama
- 🛒 **Manajemen Produk & Kategori**: Tambah, ubah, dan hapus produk dengan integrasi Cloudinary untuk penyimpanan gambar.
- 📊 **Dashboard Admin**: Laporan penjualan dan statistik transaksi secara real-time.
- 📱 **Antarmuka Pelanggan**: Menu digital yang responsif untuk memudahkan pelanggan memilih produk.
- 🔐 **Autentikasi**: Sistem login aman menggunakan JWT dan Bcrypt.
- 💳 **Integrasi QRIS**: Pembuatan kode QR untuk pembayaran non-tunai.
- 🗄️ **Prisma ORM**: Manajemen database PostgreSQL yang efisien.

## Persyaratan Minimum
Sebelum memulai, pastikan Anda telah menginstal tools berikut:
- **Node.js** (v18.0.0 atau lebih tinggi)
- **PostgreSQL** (sebagai database utama)
- **npm** (biasanya terpasang bersama Node.js) atau **yarn**

## Cara Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/monsalman/UTS-DB.git
   cd UTS-DB
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel berikut terisi di dalam `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/glowpos"
   JWT_SECRET="your_secret_key"
   CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
   ```

4. **Setup Database**
   Jalankan perintah Prisma untuk menghasilkan client dan melakukan sinkronisasi skema ke database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Menjalankan Aplikasi**
   Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Scripts
- `npm run dev` - Menjalankan aplikasi dalam mode pengembangan.
- `npm run build` - Membuat build produksi.
- `npm run start` - Menjalankan aplikasi hasil build produksi.
- `npm run lint` - Mengecek kualitas kode dengan ESLint.

---
Dikembangkan untuk kebutuhan proyek UTS Database.
