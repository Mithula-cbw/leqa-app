// Leqa © 2025 Mithula Chanthuka

import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        image TEXT
      );
    `);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
