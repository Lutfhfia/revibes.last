# Revibes Thrift Shop

## Menjalankan aplikasi lokal

Gunakan Node.js 20 atau lebih baru.

1. Jalankan MySQL lokal (konfigurasi awal ada di `backend/db.js`).
2. Salin `.env.example` menjadi `.env`, lalu isi kredensial SMTP dan URL frontend. Di PowerShell: `Copy-Item .env.example .env`, lalu buka `.env` dan isi nilainya.
3. Jalankan backend dengan `npm run backend`.
4. Di terminal lain, jalankan frontend dengan `npm run dev`.

Backend membuat tabel database yang diperlukan saat pertama kali dijalankan.

## Konfigurasi email reset password

Reset password mengirim tautan sekali pakai yang berlaku 30 menit. Untuk Gmail:

1. Aktifkan Verifikasi 2 Langkah pada akun Google pengirim.
2. Buat App Password Google dan masukkan ke `SMTP_PASSWORD` di `.env` (bukan password Gmail biasa; masukkan 16 karakter tanpa spasi).
3. Isi `SMTP_USER` dan `SMTP_FROM` dengan alamat Gmail pengirim.
4. Isi `FRONTEND_URL` dengan URL website yang akan dibuka dari email, misalnya URL deployment Vercel.
5. Hentikan backend dengan `Ctrl+C`, lalu jalankan lagi `npm run backend` setelah mengubah `.env`.
6. Jika membuka website dari Vercel tetapi backend tetap di laptop, isi `FRONTEND_URL` dengan URL Vercel tersebut. Jika membuka website lokal, gunakan `http://localhost:5173`.

Jangan commit file `.env`; file tersebut berisi kredensial email.
