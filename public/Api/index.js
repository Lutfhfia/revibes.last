const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Contoh route login di api/index.js (atau pastikan dipanggil oleh express)
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Logika verifikasi login Anda di sini
    if (email === "admin@alvi.com" && password === "12345") {
      return res.json({ id: 1, name: "Admin", email });
    }

    // Pastikan jika gagal SELALU kirim json, bukan res.end() atau res.send() kosong
    return res.status(400).json({ error: "Email atau password salah." });
  } catch (err) {
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// WAJIB: Export app
module.exports = app;
