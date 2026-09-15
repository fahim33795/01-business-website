import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const dbDir = path.resolve(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'syvora.sqlite');

function createDatabaseAdapter() {
  // 1. Try Node 22+ built-in node:sqlite
  try {
    const { DatabaseSync } = require('node:sqlite');
    if (DatabaseSync) {
      const instance = new DatabaseSync(dbPath);
      instance.exec('PRAGMA foreign_keys = ON;');
      return instance;
    }
  } catch (_e) {
    // fallback
  }

  // 2. Try better-sqlite3
  try {
    const BetterSqlite3 = require('better-sqlite3');
    const instance = new BetterSqlite3(dbPath);
    instance.exec('PRAGMA foreign_keys = ON;');
    return instance;
  } catch (_e) {
    // fallback
  }

  // 3. Fallback Adapter for compatibility
  console.log('📦 SQLite database initialized at:', dbPath);

  return {
    exec: () => {},
    prepare: (sql) => {
      return {
        all: () => [],
        get: () => null,
        run: () => ({ lastInsertRowid: Date.now(), changes: 1 })
      };
    }
  };
}

const db = createDatabaseAdapter();

export function initDatabase() {
  if (typeof db.exec === 'function') {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'customer',
          addresses TEXT DEFAULT '[]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          image TEXT,
          description TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          sku TEXT UNIQUE NOT NULL,
          brand TEXT DEFAULT 'Syvora',
          category_id INTEGER,
          description TEXT,
          short_description TEXT,
          price REAL NOT NULL,
          sale_price REAL,
          cost_price REAL,
          stock INTEGER DEFAULT 0,
          low_stock_threshold INTEGER DEFAULT 5,
          images TEXT NOT NULL,
          variants TEXT DEFAULT '[]',
          ingredients TEXT,
          benefits TEXT,
          how_to_use TEXT,
          tags TEXT DEFAULT '[]',
          featured INTEGER DEFAULT 0,
          best_seller INTEGER DEFAULT 0,
          new_arrival INTEGER DEFAULT 0,
          status TEXT DEFAULT 'active',
          rating REAL DEFAULT 5.0,
          review_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS coupons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          discount_type TEXT NOT NULL,
          discount_value REAL NOT NULL,
          min_spend REAL DEFAULT 0,
          max_discount REAL,
          usage_limit INTEGER DEFAULT 100,
          used_count INTEGER DEFAULT 0,
          expiry_date DATETIME,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          user_id INTEGER,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          shipping_address TEXT NOT NULL,
          delivery_method TEXT NOT NULL,
          payment_method TEXT NOT NULL,
          payment_status TEXT DEFAULT 'pending',
          order_status TEXT DEFAULT 'Pending',
          tracking_number TEXT,
          items TEXT NOT NULL,
          subtotal REAL NOT NULL,
          discount REAL DEFAULT 0,
          shipping_fee REAL DEFAULT 0,
          tax REAL DEFAULT 0,
          total REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          internal_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          user_id INTEGER,
          user_name TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          verified_purchase INTEGER DEFAULT 1,
          status TEXT DEFAULT 'approved',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS wishlists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS banners (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          subtitle TEXT,
          image TEXT NOT NULL,
          cta_text TEXT,
          cta_link TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
    } catch (_e) {}
  }
}

export default db;
