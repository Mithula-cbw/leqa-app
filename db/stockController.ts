// Leqa © 2025 Mithula Chanthuka

import { Product, StockItem } from "@/types/stock";
import { SQLiteDatabase } from "expo-sqlite";

export const stockController = (db: SQLiteDatabase) => {
  return {
    // Create a New Product (The Blueprint)
    // Leqa © 2025 Mithula Chanthuka

    createProduct: async (
      title: string,
      description: string,
      weight: string,
      price: number, // Added price
      image?: string,
      defaultShelfLife?: number
    ) => {
      const existing = await db.getFirstAsync<{ id: number }>(
        "SELECT id FROM products WHERE LOWER(TRIM(title)) = LOWER(TRIM(?)) AND LOWER(TRIM(weight)) = LOWER(TRIM(?))",
        [title, weight]
      );

      if (existing) {
        throw new Error(`Product "${title}" already exists.`);
      }

      return await db.runAsync(
        "INSERT INTO products (title, description, weight, price, image, default_shelf_life) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          weight,
          price,
          image ?? null,
          defaultShelfLife ?? null,
        ]
      );
    },

    // Add a Stock Batch (Specific packets)
    addStockBatch: async (
      productId: number,
      quantity: number,
      expiryDate: string
    ) => {
      // Get the current highest batch number for this specific product
      const result = await db.getFirstAsync<{ maxBatch: number }>(
        "SELECT MAX(batch_number) as maxBatch FROM stock_items WHERE product_id = ?",
        [productId]
      );

      const nextBatchNumber = (result?.maxBatch || 0) + 1;

      // Insert the new batch
      return await db.runAsync(
        "INSERT INTO stock_items (product_id, batch_number, quantity, expiry_date) VALUES (?, ?, ?, ?)",
        [productId, nextBatchNumber, quantity, expiryDate]
      );
    },

    // Get All Products with their Total Stock (For Main List)
    getAllProducts: async (): Promise<Product[]> => {
      return await db.getAllAsync<Product>(`
        SELECT 
          p.*, 
          COALESCE(SUM(s.quantity), 0) as total_stock
        FROM products p
        LEFT JOIN stock_items s ON p.id = s.product_id
        GROUP BY p.id
        ORDER BY p.title ASC
      `);
    },

    // Get specific batches for a product (For Detail View)
    getProductBatches: async (productId: number): Promise<StockItem[]> => {
      return await db.getAllAsync<StockItem>(
        "SELECT * FROM stock_items WHERE product_id = ? ORDER BY expiry_date ASC",
        [productId]
      );
    },

    // Reduce Stock (FEFO Logic: First Expired, First Out)
    reduceStock: async (productId: number, amountToReduce: number) => {
      const batches = await db.getAllAsync<StockItem>(
        "SELECT id, quantity FROM stock_items WHERE product_id = ? ORDER BY expiry_date ASC",
        [productId]
      );

      let remaining = amountToReduce;

      for (const batch of batches) {
        if (remaining <= 0) break;

        if (batch.quantity <= remaining) {
          remaining -= batch.quantity;
          await db.runAsync("DELETE FROM stock_items WHERE id = ?", [batch.id]);
        } else {
          await db.runAsync(
            "UPDATE stock_items SET quantity = quantity - ? WHERE id = ?",
            [remaining, batch.id]
          );
          remaining = 0;
        }
      }
      return remaining === 0;
    },

    // Delete Product (Will also delete all batches due to ON DELETE CASCADE)
    deleteProduct: async (productId: number) => {
      return await db.runAsync("DELETE FROM products WHERE id = ?", [
        productId,
      ]);
    },
  };
};
