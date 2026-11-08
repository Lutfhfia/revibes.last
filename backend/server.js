import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";
import { createHash, randomBytes } from "crypto";
import nodemailer from "nodemailer";
import db from "./db.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads", "products");
const resetEmailMessage =
  "Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim.";
const resetRequestTimes = new Map();
const resetRequestWindowMs = 15 * 60 * 1000;
const resetRequestLimit = 5;
let mailTransporter;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const parseJsonArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const saveProductImages = async (imageFiles = []) => {
  if (!Array.isArray(imageFiles) || imageFiles.length === 0) return [];

  await fs.mkdir(uploadsDir, { recursive: true });

  const savedImages = [];
  for (const [index, file] of imageFiles.entries()) {
    if (!file?.dataUrl?.startsWith("data:image/")) continue;

    const extension = file.type?.split("/")[1]?.split("+")[0] || "png";
    const safeName = file.name
      ? path
          .parse(file.name)
          .name.replace(/[^a-z0-9_-]/gi, "-")
          .toLowerCase()
      : "product";
    const fileName = `${Date.now()}-${index}-${safeName}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);
    const base64Data = file.dataUrl.split(",")[1];

    await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));
    savedImages.push(`http://localhost:5000/uploads/products/${fileName}`);
  }

  return savedImages;
};

// ==========================================
// AUTHENTICATION API
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(
      `SELECT id, name, email, phone, address, role
       FROM users
       WHERE email = ? AND password = ?
       LIMIT 1`,
      [email.trim(), password],
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(401).json({ error: "Email atau password salah" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, "user"],
    );

    const [newUser] = await db.query(
      "SELECT id, name, email, phone, address, role FROM users WHERE id = ?",
      [result.insertId],
    );
    res.json(newUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const email = req.body?.email;
  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "Alamat email wajib diisi." });
  }

  const now = Date.now();
  for (const [ip, timestamps] of resetRequestTimes) {
    const recentRequests = timestamps.filter(
      (timestamp) => now - timestamp < resetRequestWindowMs,
    );
    if (recentRequests.length === 0) {
      resetRequestTimes.delete(ip);
    } else {
      resetRequestTimes.set(ip, recentRequests);
    }
  }
  const recentRequests = resetRequestTimes.get(req.ip) || [];
  if (recentRequests.length >= resetRequestLimit) {
    return res.status(429).json({
      error: "Terlalu banyak permintaan. Coba lagi dalam 15 menit.",
    });
  }
  recentRequests.push(now);
  resetRequestTimes.set(req.ip, recentRequests);

  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return res.status(503).json({
      error:
        "Email reset belum dikonfigurasi. Isi SMTP_HOST, SMTP_USER, dan SMTP_PASSWORD di file .env, lalu restart backend.",
    });
  }

  try {
    const [users] = await db.query(
      "SELECT id, email FROM users WHERE email = ? LIMIT 1",
      [email.trim()],
    );
    if (users.length === 0) {
      return res.json({ message: resetEmailMessage });
    }

    const user = users[0];
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const frontendUrl = new URL(
      process.env.FRONTEND_URL || "http://localhost:5173",
    );
    if (!["http:", "https:"].includes(frontendUrl.protocol)) {
      throw new Error("FRONTEND_URL must use HTTP or HTTPS.");
    }
    frontendUrl.pathname = "/reset-password";
    frontendUrl.search = "";
    frontendUrl.hash = "";
    frontendUrl.searchParams.set("token", token);
    const resetUrl = frontendUrl.toString();

    await db.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), NULL)
       ON DUPLICATE KEY UPDATE
         token_hash = VALUES(token_hash),
         expires_at = VALUES(expires_at),
         used_at = NULL,
         created_at = CURRENT_TIMESTAMP`,
      [user.id, tokenHash],
    );

    try {
      mailTransporter ??= nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE
          ? process.env.SMTP_SECURE === "true"
          : Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });

      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || SMTP_USER,
        to: user.email,
        subject: "Atur ulang password Revibes",
        text: `Kami menerima permintaan untuk mengatur ulang password akun Anda.\n\nBuka tautan ini dalam 30 menit:\n${resetUrl}\n\nJika Anda tidak meminta reset password, abaikan email ini.`,
        html: `<p>Kami menerima permintaan untuk mengatur ulang password akun Anda.</p><p><a href="${resetUrl}">Atur ulang password</a></p><p>Tautan berlaku selama 30 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>`,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    } catch (error) {
      await db.query(
        "DELETE FROM password_reset_tokens WHERE user_id = ? AND token_hash = ?",
        [user.id, tokenHash],
      );
      throw error;
    }

    return res.json({ message: resetEmailMessage });
  } catch (error) {
    console.error("Password reset email failed:", error);
    return res
      .status(500)
      .json({ error: "Email reset gagal dikirim. Coba lagi nanti." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body ?? {};
  if (typeof token !== "string" || !token || typeof password !== "string") {
    return res.status(400).json({ error: "Tautan reset tidak valid." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password baru minimal 8 karakter." });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [tokens] = await connection.execute(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = ? AND expires_at > NOW() AND used_at IS NULL
       FOR UPDATE`,
      [createHash("sha256").update(token).digest("hex")],
    );
    if (tokens.length === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ error: "Tautan reset tidak valid atau sudah kedaluwarsa." });
    }

    await connection.execute("UPDATE users SET password = ? WHERE id = ?", [
      password,
      tokens[0].user_id,
    ]);
    await connection.execute(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?",
      [tokens[0].id],
    );
    await connection.commit();

    return res.json({ message: "Password berhasil diperbarui." });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Password reset failed:", error);
    return res
      .status(500)
      .json({ error: "Password gagal diperbarui. Coba lagi nanti." });
  } finally {
    connection?.release();
  }
});

app.put("/api/auth/update", async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;
    await db.query(
      "UPDATE users SET name = ?, phone = ?, address = ? WHERE email = ?",
      [name, phone, address, email],
    );
    const [updatedUser] = await db.query(
      "SELECT id, name, email, phone, address, role FROM users WHERE email = ?",
      [email],
    );
    res.json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PRODUCTS API
// ==========================================

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    const products = rows.map((product) => {
      const images = parseJsonArray(
        product.images,
        product.image ? [product.image] : [],
      );

      return {
        ...product,
        images,
        image: images[0] || product.image,
        sizes: parseJsonArray(product.sizes),
        colors: parseJsonArray(product.colors),
        materials: parseJsonArray(product.materials),
      };
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      imageFiles,
      sizes,
      colors,
      materials,
      description,
    } = req.body;
    const images = await saveProductImages(imageFiles);
    const image = images[0];

    if (!image) {
      return res
        .status(400)
        .json({ error: "Minimal satu gambar produk wajib diunggah." });
    }

    const [result] = await db.query(
      "INSERT INTO products (name, price, category, image, images, sizes, colors, materials, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        price,
        category,
        image,
        JSON.stringify(images),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        JSON.stringify(materials || []),
        description || "",
      ],
    );

    res.json({
      id: result.insertId,
      name,
      price,
      category,
      image,
      images,
      sizes,
      colors,
      materials,
      description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// UPDATE PRODUCT
// ==========================================

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, price, category, imageFiles } = req.body;

    // Cari produk lama
    const [existingRows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        error: "Produk tidak ditemukan.",
      });
    }

    const existingProduct = existingRows[0];

    // Default gunakan gambar lama
    let image = existingProduct.image;
    let images = parseJsonArray(
      existingProduct.images,
      existingProduct.image ? [existingProduct.image] : [],
    );

    // Kalau user upload gambar baru
    if (Array.isArray(imageFiles) && imageFiles.length > 0) {
      const uploadedImages = await saveProductImages(imageFiles);

      if (uploadedImages.length > 0) {
        images = uploadedImages;
        image = uploadedImages[0];
      }
    }

    await db.query(
      `
      UPDATE products
      SET
        name = ?,
        price = ?,
        category = ?,
        image = ?,
        images = ?
      WHERE id = ?
      `,
      [name, price, category, image, JSON.stringify(images), id],
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );

    const updatedProduct = updatedRows[0];

    res.json({
      ...updatedProduct,
      images: parseJsonArray(updatedProduct.images),
      image: updatedProduct.image,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ORDERS API
// ==========================================

app.get("/api/orders", async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );

    // Fetch items for each order
    for (let order of orders) {
      const [items] = await db.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id],
      );
      order.items = items.map((item) => ({
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      }));
      // Map keys to camelCase for frontend compatibility
      order.customerName = order.customer_name;
      order.customerEmail = order.customer_email;
      order.customerAddress = order.customer_address;
      order.date = order.created_at;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const {
      id,
      customerName,
      customerEmail,
      customerAddress,
      notes,
      total,
      status,
      items,
    } = req.body;

    await db.query(
      "INSERT INTO orders (id, customer_name, customer_email, customer_address, notes, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, customerName, customerEmail, customerAddress, notes, total, status],
    );

    for (let item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_name, price, quantity, size, color, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          item.name,
          item.price,
          item.quantity || 1,
          item.size || "L",
          item.color || "Hitam",
          item.image,
        ],
      );
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CHATS API
// ==========================================

// ==========================================
// CHATS API
// ==========================================

// GET SEMUA CHAT
app.get("/api/chats", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM chats ORDER BY timestamp ASC");

    const formattedChats = rows.map((row) => ({
      id: row.id,
      senderEmail: row.sender_email,
      receiverEmail: row.receiver_email,
      text: row.text,
      timestamp: row.timestamp,
    }));

    res.json(formattedChats);
  } catch (error) {
    console.error("GET CHATS ERROR:", error);

    res.status(500).json({
      error: "Gagal mengambil data chat.",
    });
  }
});

// KIRIM CHAT
app.post("/api/chats", async (req, res) => {
  try {
    const { senderEmail, receiverEmail, text } = req.body;

    if (
      typeof senderEmail !== "string" ||
      typeof receiverEmail !== "string" ||
      typeof text !== "string" ||
      !senderEmail.trim() ||
      !receiverEmail.trim() ||
      !text.trim()
    ) {
      return res.status(400).json({
        error: "Pengirim, penerima, dan pesan wajib diisi.",
      });
    }

    const [participants] = await db.query(
      "SELECT email FROM users WHERE email IN (?, ?)",
      [senderEmail.trim(), receiverEmail.trim()],
    );
    if (participants.length !== 2) {
      return res.status(400).json({
        error:
          "Akun chat tidak ditemukan di database lokal. Daftar atau login ulang saat backend lokal aktif.",
      });
    }

    const cleanText = text.trim();

    const [result] = await db.query(
      `
      INSERT INTO chats
      (sender_email, receiver_email, text)
      VALUES (?, ?, ?)
      `,
      [senderEmail.trim(), receiverEmail.trim(), cleanText],
    );

    res.status(201).json({
      id: result.insertId,
      senderEmail: senderEmail.trim(),
      receiverEmail: receiverEmail.trim(),
      text: cleanText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SEND CHAT ERROR:", error);

    res.status(500).json({
      error: "Gagal mengirim pesan.",
    });
  }
});

// ==========================================
// GET ADMIN ACCOUNT
// ==========================================
app.get("/api/admin", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, name, email
      FROM users
      WHERE role = 'admin'
      LIMIT 1
      `,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Akun admin tidak ditemukan.",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET ADMIN ERROR:", error);

    res.status(500).json({
      error: "Gagal mengambil data admin.",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
