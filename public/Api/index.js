const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Contoh endpoint API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello dari backend Serverless Vercel!" });
});

// Tambahkan route backend Anda yang lain di sini...

// SANGAT PENTING: Export app, jangan gunakan app.listen()
module.exports = app;
