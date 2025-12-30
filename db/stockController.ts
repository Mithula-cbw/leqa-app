// Leqa © 2025 Mithula Chanthuka

import { Product, StockItem } from "@/types/stock";
import { SQLiteDatabase } from "expo-sqlite";

//  Helpers
const toDbDate = (date: Date | null): string | null =>
  date ? date.toISOString() : null;

const fromDbDate = (value: string | null): Date | null =>
  value ? new Date(value) : null;

export const stockController = (db: SQLiteDatabase) => {
  return {
    //Create Product (Blueprint)
    createProduct: async (
      title: string,
      description: string,
      weight: string,
      price: number,
      image?: string | null,
      shelfLifeValue?: number,
      shelfLifeUnit?: "days" | "hours" | "years" | null
    ) => {
      const existing = await db.getFirstAsync<{ id: number }>(
        `
        SELECT id
        FROM products
        WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))
          AND LOWER(TRIM(weight)) = LOWER(TRIM(?))
          AND price = ?
        `,
        [title, weight, price]
      );

      if (existing) {
        throw new Error(`Product "${title}" already exists.`);
      }

      return await db.runAsync(
        `
        INSERT INTO products
          (title, description, weight, price, image, shelf_life_value, shelf_life_unit)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title,
          description,
          weight,
          price,
          image ?? null,
          shelfLifeValue ?? 1,
          shelfLifeUnit ?? "days",
        ]
      );
    },

    // Add Stock Batch (Date + Time)
    // inside stockController.ts

    addStockBatch: async (
      productId: number,
      quantity: number,
      expiryAt: Date,
      customBatchNumber?: number,
    ) => {
      if (!(expiryAt instanceof Date)) {
        throw new Error("expiryAt must be a Date");
      }

      let batchToUse: number;

      if (customBatchNumber) {
        batchToUse = customBatchNumber;
      } else {
        const result = await db.getFirstAsync<{ maxBatch: number }>(
          `SELECT MAX(batch_number) as maxBatch FROM stock_items WHERE product_id = ?`,
          [productId]
        );
        batchToUse = (result?.maxBatch || 0) + 1;
      }

      return await db.runAsync(
        `INSERT INTO stock_items (product_id, batch_number, quantity, expiry_at) VALUES (?, ?, ?, ?)`,
        [productId, batchToUse, quantity, toDbDate(expiryAt)]
      );
    },

    //Products + Total Stock
    getAllProducts: async (): Promise<Product[]> => {
      return await db.getAllAsync<Product>(`
        SELECT
          p.*,
          COALESCE(SUM(s.quantity), 0) AS total_stock
        FROM products p
        LEFT JOIN stock_items s ON p.id = s.product_id
        GROUP BY p.id
        ORDER BY
          p.is_pinned DESC,
          total_stock DESC,
          p.title ASC
      `);
    },

    //Batches for One Product
    getProductBatches: async (productId: number): Promise<StockItem[]> => {
      const rows = await db.getAllAsync<any>(
        `
        SELECT *
        FROM stock_items
        WHERE product_id = ?
        ORDER BY expiry_at ASC
        `,
        [productId]
      );

      return rows.map((row) => ({
        id: row.id,
        product_id: row.product_id,
        batch_number: row.batch_number,
        quantity: row.quantity,
        expiry_at: fromDbDate(row.expiry_at),
        created_at: new Date(row.created_at),
      }));
    },

    //Reduce Stock (FEFO)
    reduceStock: async (productId: number, amountToReduce: number) => {
      const batches = await db.getAllAsync<any>(
        `
        SELECT id, quantity
        FROM stock_items
        WHERE product_id = ?
        ORDER BY expiry_at ASC
        `,
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
            `
            UPDATE stock_items
            SET quantity = quantity - ?
            WHERE id = ?
            `,
            [remaining, batch.id]
          );
          remaining = 0;
        }
      }

      return remaining === 0;
    },

    //Delete Product
    deleteProduct: async (productId: number) => {
      return await db.runAsync("DELETE FROM products WHERE id = ?", [
        productId,
      ]);
    },

    //Pin / Unpin
    togglePin: async (productId: number, isPinned: boolean) => {
      return await db.runAsync(
        `
        UPDATE products
        SET is_pinned = ?
        WHERE id = ?
        `,
        [isPinned ? 1 : 0, productId]
      );
    },

    // Fetch every batch in the database (for Context)
    getAllBatches: async (): Promise<StockItem[]> => {
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM stock_items ORDER BY created_at DESC`
      );

      return rows.map((row) => ({
        id: row.id,
        product_id: row.product_id,
        batch_number: row.batch_number,
        quantity: row.quantity,
        expiry_at: fromDbDate(row.expiry_at),
        created_at: new Date(row.created_at),
      }));
    },

    // Delete a specific batch by ID
    deleteBatch: async (batchId: number) => {
      return await db.runAsync("DELETE FROM stock_items WHERE id = ?", [
        batchId,
      ]);
    },
  };
};
