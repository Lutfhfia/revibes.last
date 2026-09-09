# Panduan Fitur Chat Admin-User

Sistem chat telah diupgrade untuk mendukung komunikasi real-time antara admin dan multiple users dengan fitur-fitur yang lebih baik.

## 🎯 Fitur Utama

### 1. **Admin Chat** (`/admin/chat`)

Admin dapat menerima dan membalas pesan dari banyak user pelanggan:

- ✅ Melihat daftar semua pelanggan yang telah mengirim pesan
- ✅ Menampilkan badge penghitung pesan baru
- ✅ Menampilkan preview pesan terakhir dari setiap pelanggan
- ✅ Sorting otomatis - percakapan terbaru di atas
- ✅ Tampil status "Siap membantu" ketika admin online
- ✅ Interface chat yang responsif dan user-friendly

### 2. **User Chat** (`/chat`)

User yang telah login dapat menghubungi admin:

- ✅ Percakapan one-to-one dengan admin
- ✅ Auto-loading admin email dari database
- ✅ Menampilkan status ketersediaan admin
- ✅ Scroll otomatis ke pesan terbaru
- ✅ Format waktu yang jelas (hari ini vs hari lain)
- ✅ Pesan otomatis ketika admin tidak tersedia

## 🔧 Struktur Database

Database `db_revibes` memiliki tabel `chats` dengan struktur:

```sql
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_email VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_email) REFERENCES users(email) ON DELETE CASCADE,
  FOREIGN KEY (receiver_email) REFERENCES users(email) ON DELETE CASCADE
)
```

## 📝 Context Functions (DatabaseContext.jsx)

### `sendMessage(senderEmail, receiverEmail, text)`

Mengirim pesan baru ke database

```javascript
await sendMessage(currentUser.email, adminEmail, "Hello Admin!");
```

### `getChatBetween(email1, email2)`

Mendapatkan semua pesan antara dua user (boleh arah manapun)

```javascript
const messages = getChatBetween(userEmail, adminEmail);
```

### `getChatUsersForAdmin(adminEmail)`

Mendapatkan daftar semua user yang pernah chat dengan admin

```javascript
const users = getChatUsersForAdmin(currentUser.email);
```

## 🚀 Cara Menggunakan

### Untuk User (Pelanggan)

1. Login ke akun user
2. Klik menu "Chat" atau navigasi ke `/chat`
3. Ketik pesan dan tekan tombol Send atau Enter
4. Tunggu balasan dari admin

### Untuk Admin

1. Login dengan akun admin (`email: admin@alvi.com`, `password: admin`)
2. Navigasi ke "Admin Chat" atau akses `/admin/chat`
3. Pilih pelanggan dari list di sebelah kiri
4. Baca pesan dan berikan jawaban
5. Tekan Send untuk mengirim balasan

## 🎨 UI Improvements

### Admin Chat Page

- Sidebar menampilkan 33% lebar, chat area 67%
- Badge merah menampilkan jumlah pesan belum dibaca
- Sort otomatis berdasarkan pesan terakhir
- Header dengan status online indicator
- Message counter untuk setiap percakapan

### User Chat Page

- Clean interface dengan header status
- Loading indicator saat connect ke admin
- Green status indicator ketika admin siap
- Error message jika admin tidak tersedia
- Pesan welcome jika belum ada percakapan

## 💾 Backend API Endpoints

### GET `/api/chats`

Mengambil semua pesan (difilter di frontend)

```bash
curl http://localhost:5000/api/chats
```

### POST `/api/chats`

Mengirim pesan baru

```bash
curl -X POST http://localhost:5000/api/chats \
  -H "Content-Type: application/json" \
  -d '{
    "senderEmail": "user@example.com",
    "receiverEmail": "admin@alvi.com",
    "text": "Halo admin, saya punya pertanyaan"
  }'
```

### GET `/api/admin`

Mengambil info admin (nama dan email)

```bash
curl http://localhost:5000/api/admin
```

## 📋 Default Admin Account

```
Email: admin@alvi.com
Password: admin
Role: admin
```

Untuk mengubah akun admin, edit di `backend/db.js`

## 🐛 Troubleshooting

### Chat tidak muncul?

1. Pastikan backend berjalan: `node backend/server.js`
2. Cek browser console untuk error messages
3. Pastikan user sudah login
4. Refresh halaman

### Admin tidak terlihat?

1. Pastikan ada akun dengan role='admin' di database
2. Check endpoint `/api/admin` di browser

### Pesan tidak terkirim?

1. Cek koneksi internet
2. Buka DevTools (F12) > Network tab
3. Lihat status response dari POST `/api/chats`

## 📱 Responsive Design

Sistem chat telah dioptimalkan untuk:

- Desktop (100% recommended)
- Tablet (dengan beberapa adjustment)
- Mobile (minor layout adjustments)

## 🔄 Auto Refresh

Frontend melakukan auto-refresh data setiap 5 detik (dari DatabaseContext.jsx)

## 📌 Catatan Penting

1. Pesan hanya dapat dikirim antar user yang telah terdaftar
2. Admin dapat chat dengan multiple user secara bersamaan
3. Tidak ada limit jumlah pesan per percakapan
4. Timestamp menggunakan server time (MySQL CURRENT_TIMESTAMP)
5. Chat bersifat permanent di database

## 🎓 Next Steps (Optional Enhancements)

1. **Read Status**: Tandai pesan yang sudah dibaca
2. **Typing Indicator**: Tampilkan "Admin sedang mengetik..."
3. **File Sharing**: Izinkan upload gambar/dokumen
4. **Notification**: Push notification untuk pesan baru
5. **Chat History**: Export chat history to PDF
6. **Search**: Cari pesan dalam percakapan
7. **Archive**: Arsipkan percakapan lama

---

**Last Updated**: 2026-09-09
**Status**: ✅ Production Ready
