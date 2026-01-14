import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
    DROP TABLE IF EXISTS stock_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS transactions;
    DROP TABLE IF EXISTS stock_logs;
`);
    console.log("The DB was reset");

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
        weight_value REAL,
        weight_unit TEXT CHECK(weight_unit IN ('g', 'kg')),
        image TEXT,
        price REAL DEFAULT 0.0,
        do_expire INTEGER DEFAULT 0, -- 0 for false, 1 for true,
        shelf_life_years INTEGER, 
        shelf_life_months INTEGER, 
        shelf_life_days INTEGER, 
        shelf_life_hours INTEGER,
        do_warn INTEGER DEFAULT 0, -- 0 for false, 1 for true,
        warning_period_months INTEGER,     
        warning_period_days INTEGER, 
        warning_period_hours INTEGER,    
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
        expiry_at TEXT,
        warn_at Text,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT,
        phone TEXT,
        email TEXT,
        is_pinned INTEGER DEFAULT 0, -- 0 for false, 1 for true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Transactions Table (The Ledger)
      -- Type: 'sale' (Income), 'expense' (Outcome), 'other_income' (Income)
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('sale', 'expense', 'other_income')),
        category TEXT, -- e.g., 'Rent', 'Electricity', 'Direct Sale'
        amount REAL NOT NULL,
        description TEXT,
        customer_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      );

      -- Stock Reductions (Audit Log)
      -- Reason: 'sale', 'expired', 'waste', 'silent'
      CREATE TABLE IF NOT EXISTS stock_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT NOT NULL CHECK(reason IN ('sale', 'expired', 'waste', 'silent')),
        transaction_id INTEGER, -- Linked if it was a sale
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      );
    `);

    await db.runAsync(`
      INSERT OR IGNORE INTO customers (id, name, email, is_pinned) 
      VALUES (1, 'Unknown', 'default@system.local', 1);
    `);

    console.log("Database tables and relations initialized.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
