import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    // await db.execAsync(`DROP TABLE IF EXISTS products;`);
    // console.log("The DB was reset");

    await db.execAsync(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;`);

    await db.execAsync(`
      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        image TEXT
      );

      -- Products Table (The Blueprint)
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        weight TEXT,
        image TEXT,
        price REAL DEFAULT 0.0,
        default_shelf_life INTEGER, -- days until expiry,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_pinned INTEGER DEFAULT 0, -- 0 for false, 1 for true,
        sort_order INTEGER DEFAULT 0
);

      -- StockItems Table (The individual batches)
      CREATE TABLE IF NOT EXISTS stock_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_number INTEGER,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        expiry_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
    `);

    console.log("Database tables and relations initialized.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
