import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("vstore.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    image TEXT,
    rating REAL DEFAULT 0,
    is_trending INTEGER DEFAULT 0,
    is_best_seller INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed Data if empty
const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get().count;
if (categoryCount === 0) {
  const insertCategory = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
  insertCategory.run("Electronics", "electronics", "https://picsum.photos/seed/electronics/400/400");
  insertCategory.run("Fashion", "fashion", "https://picsum.photos/seed/fashion/400/400");
  insertCategory.run("Home Decor", "home-decor", "https://picsum.photos/seed/home/400/400");
  insertCategory.run("Beauty", "beauty", "https://picsum.photos/seed/beauty/400/400");

  const insertProduct = db.prepare("INSERT INTO products (name, slug, description, price, category_id, image, rating, is_trending, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertProduct.run("Premium Wireless Headphones", "wireless-headphones", "High-quality sound with noise cancellation.", 299.99, 1, "https://picsum.photos/seed/headphones/600/600", 4.8, 1, 1);
  insertProduct.run("Smart Watch Series V", "smart-watch-v", "Stay connected and track your health.", 199.99, 1, "https://picsum.photos/seed/watch/600/600", 4.5, 1, 0);
  insertProduct.run("Luxury Silk Scarf", "silk-scarf", "Elegant silk scarf for any occasion.", 49.99, 2, "https://picsum.photos/seed/scarf/600/600", 4.7, 0, 1);
  insertProduct.run("Minimalist Table Lamp", "table-lamp", "Modern design for your workspace.", 89.99, 3, "https://picsum.photos/seed/lamp/600/600", 4.6, 1, 0);
  insertProduct.run("Organic Face Serum", "face-serum", "Natural ingredients for glowing skin.", 39.99, 4, "https://picsum.photos/seed/serum/600/600", 4.9, 0, 1);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/products/trending", (req, res) => {
    const products = db.prepare("SELECT * FROM products WHERE is_trending = 1").all();
    res.json(products);
  });

  app.get("/api/products/best-sellers", (req, res) => {
    const products = db.prepare("SELECT * FROM products WHERE is_best_seller = 1").all();
    res.json(products);
  });

  app.get("/api/products/:slug", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)").run(name, email, phone, password);
      res.json({ id: info.lastInsertRowid, name, email });
    } catch (error) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/addresses/:userId", (req, res) => {
    const addresses = db.prepare("SELECT * FROM addresses WHERE user_id = ?").all(req.params.userId);
    res.json(addresses);
  });

  app.post("/api/addresses", (req, res) => {
    const { userId, fullName, phone, addressLine, city, state, pincode } = req.body;
    const info = db.prepare("INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)").run(userId, fullName, phone, addressLine, city, state, pincode);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
