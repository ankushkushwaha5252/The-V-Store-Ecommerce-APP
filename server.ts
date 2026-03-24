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

// Seed Data if empty or needs update
const needsElectronicsSeed = db.prepare("SELECT count(*) as count FROM categories WHERE slug = 'smartphones'").get().count === 0;
if (needsElectronicsSeed) {
  // Clear existing data to avoid conflicts
  db.exec("DELETE FROM products");
  db.exec("DELETE FROM categories");
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('products', 'categories')");

  const categories = [
    { name: "Smartphones", slug: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400" },
    { name: "Laptops", slug: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400" },
    { name: "Audio & Headphones", slug: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { name: "Wearables", slug: "wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
    { name: "Cameras", slug: "cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400" },
    { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1541140532154-b024d715b909?auto=format&fit=crop&q=80&w=400" }
  ];

  const insertCategory = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
  categories.forEach(cat => insertCategory.run(cat.name, cat.slug, cat.image));

  const insertProduct = db.prepare("INSERT INTO products (name, slug, description, price, category_id, image, rating, is_trending, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

  const productTemplates = [
    { catId: 1, prefix: "Phone", names: ["Pro Max", "Ultra", "Lite", "Fold", "Flip", "Neo", "Edge", "Prime", "Plus", "S", "X", "Z", "V", "Alpha", "Omega"] },
    { catId: 2, prefix: "Laptop", names: ["Air", "Book Pro", "Gaming X", "Studio", "Elite", "Zen", "Think", "Surface", "Flow", "Blade", "Stealth", "Creator", "Workstation", "Slim", "Touch"] },
    { catId: 3, prefix: "Audio", names: ["Buds Pro", "Over-Ear", "Soundbar", "Speaker", "Hi-Fi", "Studio", "Wireless", "Noise-Cancelling", "Bass", "Treble", "Surround", "Pod", "Link", "Sync", "Wave"] },
    { catId: 4, prefix: "Watch", names: ["Series 7", "Active", "Fit", "Classic", "Sport", "Luxury", "Smart", "Tracker", "Band", "Pulse", "Core", "Titan", "Solar", "Lunar", "Orbit"] },
    { catId: 5, prefix: "Camera", names: ["Mirrorless", "DSLR", "Action", "Compact", "Pro", "Vision", "Capture", "Focus", "Lens", "Optical", "Digital", "Cinema", "Vlog", "Snap", "Shot"] },
    { catId: 6, prefix: "Accessory", names: ["Cable", "Charger", "Case", "Stand", "Hub", "Adapter", "Mount", "Screen Protector", "Bag", "Sleeve", "Dock", "Keyboard", "Mouse", "Pad", "Stylus"] }
  ];

  let productCount = 0;
  productTemplates.forEach(template => {
    template.names.forEach((name, idx) => {
      const productName = `${template.prefix} ${name}`;
      const slug = productName.toLowerCase().replace(/\s+/g, '-') + `-${productCount}`;
      const price = Math.floor(Math.random() * 1000) + 19.99;
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
      const isTrending = Math.random() > 0.8 ? 1 : 0;
      const isBestSeller = Math.random() > 0.8 ? 1 : 0;
      const image = `https://picsum.photos/seed/${slug}/600/600`;
      
      insertProduct.run(
        productName,
        slug,
        `Experience the next generation of technology with the ${productName}. Featuring cutting-edge design and industry-leading performance.`,
        price,
        template.catId,
        image,
        rating,
        isTrending,
        isBestSeller
      );
      productCount++;
    });
  });

  // Add some more to reach ~100
  for (let i = 0; i < 10; i++) {
    const catId = Math.floor(Math.random() * 6) + 1;
    const productName = `Special Edition Tech ${i}`;
    const slug = `special-tech-${i}`;
    insertProduct.run(
      productName,
      slug,
      "A limited edition release for tech enthusiasts.",
      499.99,
      catId,
      `https://picsum.photos/seed/${slug}/600/600`,
      4.9,
      1,
      1
    );
  }
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
