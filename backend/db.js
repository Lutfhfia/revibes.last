import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// DB Configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_revibes",
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize Database and Tables
async function initDB() {
  try {
    // 1. Connect without database selected to create the DB if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`,
    );
    console.log(`Database '${dbConfig.database}' ensured.`);
    await connection.end();

    // 2. Connect to the specific database
    const db = await mysql.createConnection(dbConfig);

    // Create Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert default Admin if users table is empty
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      "admin@alvi.com",
    ]);
    if (users.length === 0) {
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Administrator", "admin@alvi.com", "admin", "admin"],
      );
      console.log("Default admin created.");
    }

    // Create Products Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        images TEXT,
        sizes TEXT,
        colors TEXT,
        materials TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [productColumns] = await db.query(
      `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
    `,
      [dbConfig.database],
    );
    const existingProductColumns = productColumns.map(
      (column) => column.COLUMN_NAME,
    );
    const productColumnUpdates = [
      ["images", "ALTER TABLE products ADD COLUMN images TEXT AFTER image"],
      ["sizes", "ALTER TABLE products ADD COLUMN sizes TEXT AFTER images"],
      ["colors", "ALTER TABLE products ADD COLUMN colors TEXT AFTER sizes"],
      [
        "materials",
        "ALTER TABLE products ADD COLUMN materials TEXT AFTER colors",
      ],
      [
        "description",
        "ALTER TABLE products ADD COLUMN description TEXT AFTER materials",
      ],
    ];

    for (const [columnName, alterSql] of productColumnUpdates) {
      if (!existingProductColumns.includes(columnName)) {
        await db.query(alterSql);
      }
    }

    // Insert some default products if empty
    const [products] = await db.query("SELECT COUNT(*) as count FROM products");
    if (products[0].count === 0) {
      await db.query(`
        INSERT INTO products (name, price, category, image) VALUES 
        ('Crewneck Vintage Nike', 150000, 'Crewneck', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'),
        ('Hoodie Champion Basic', 180000, 'Hoodie', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'),
        ('Kaos Band Nirvana', 120000, 'Kaos', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800')
      `);
      console.log("Default products inserted.");
    }

    // Create Orders Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        notes TEXT,
        total INT NOT NULL,
        status ENUM('Menunggu Pembayaran', 'Dibayar', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu Pembayaran',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Order Items Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        quantity INT DEFAULT 1,
        size VARCHAR(20),
        color VARCHAR(50),
        image VARCHAR(255),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // Create Chats Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_email VARCHAR(255) NOT NULL,
        receiver_email VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_email) REFERENCES users(email) ON DELETE CASCADE,
        FOREIGN KEY (receiver_email) REFERENCES users(email) ON DELETE CASCADE
      )
    `);

    const [chatColumns] = await db.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'chats'`,
      [dbConfig.database],
    );
    const existingChatColumns = chatColumns.map(
      (column) => column.COLUMN_NAME,
    );

    if (
      !existingChatColumns.includes("receiver_email") &&
      existingChatColumns.includes("receiver_role")
    ) {
      await db.query(
        "ALTER TABLE chats CHANGE COLUMN receiver_role receiver_email VARCHAR(255) NOT NULL",
      );
    }

    const [adminAccounts] = await db.query(
      "SELECT email FROM users WHERE role = 'admin' LIMIT 1",
    );
    if (adminAccounts.length > 0) {
      await db.query(
        "UPDATE chats SET receiver_email = ? WHERE receiver_email = 'admin'",
        [adminAccounts[0].email],
      );
    }

    console.log("All tables synchronized successfully.");
    await db.end();
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
}

// Run init on startup
initDB();

export default pool;
