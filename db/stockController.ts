// Leqa © 2025 Mithula Chanthuka

import { Product, StockItem } from "@/types/stock";
import { SQLiteDatabase } from "expo-sqlite";

// Helpers
const toDbDate = (date: Date | null): string | null =>
  date ? date.toISOString() : null;

const fromDbDate = (value: string | null): Date | null =>
  value ? new Date(value) : null;

export const stockController = (db: SQLiteDatabase) => {
  return {
    // =========================
    // Create Product (Blueprint)
    // =========================
    createProduct: async (
      title: string,
      description: string,
      weight_value: number,
      weight_unit: "g" | "kg" | null,
      price: number,
      image?: string | null,
      doExpire = 0,
      shelfLifeYears = 0,
      shelfLifeMonths = 0,
      shelfLifeDays = 0,
      shelfLifeHours = 0,
      doWarn = 0,
      warningPeriodMonths = 0,
      warningPeriodDays = 0,
      warningPeriodHours = 0
    ) => {
      console.log(doExpire, doWarn)
      const existing = await db.getFirstAsync<{ id: number }>(
        `
        SELECT id
        FROM products
        WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))
          AND weight_value = ?
          AND weight_unit = ?
          AND price = ?
        `,
        [title, weight_value, weight_unit, price]
      );

      if (existing) {
        throw new Error(`Product "${title}" already exists.`);
      }

      return await db.runAsync(
        `
        INSERT INTO products (
          title,
          description,
          weight_value,
          weight_unit,
          image,
          price,
          do_expire,
          shelf_life_years,
          shelf_life_months,
          shelf_life_days,
          shelf_life_hours,
          do_warn,
          warning_period_months,
          warning_period_days,
          warning_period_hours
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title,
          description,
          weight_value ?? 0,
          weight_unit ?? "g",
          image ?? null,
          price,
          doExpire,
          shelfLifeYears,
          shelfLifeMonths,
          shelfLifeDays,
          shelfLifeHours,
          doWarn,
          warningPeriodMonths,
          warningPeriodDays,
          warningPeriodHours,
        ]
      );
    },

    // Add Stock Batch
    addStockBatch: async (
      productId: number,
      quantity: number,
      expiryAt: Date | null,
      warnAt: Date | null,
      customBatchNumber?: number
    ) => {
      let batchNumber = customBatchNumber;

      if (!batchNumber) {
        const result = await db.getFirstAsync<{ maxBatch: number }>(
          `SELECT MAX(batch_number) as maxBatch FROM stock_items WHERE product_id = ?`,
          [productId]
        );
        batchNumber = (result?.maxBatch || 0) + 1;
      }

      return await db.runAsync(
        `
        INSERT INTO stock_items (
          product_id,
          batch_number,
          quantity,
          expiry_at,
          warn_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [productId, batchNumber, quantity, toDbDate(expiryAt), toDbDate(warnAt)]
      );
    },

    // =========================
    // Products + Total Stock
    // =========================
    getAllProducts: async (): Promise<Product[]> => {
      return await db.getAllAsync<Product>(
        `
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
        `
      );
    },

    // =========================
    // Batches for One Product
    // =========================
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
        warn_at: fromDbDate(row.warn_at),
        created_at: new Date(row.created_at),
      }));
    },

    // =========================
    // Update Product Field
    // =========================
    updateProductField: async (
      productId: number,
      field: string,
      value: any
    ) => {
      const allowedFields = [
        "title",
        "description",
        "weight_value",
        "weight_unit",
        "price",
        "image",
        "shelf_life_years",
        "shelf_life_months",
        "shelf_life_days",
        "shelf_life_hours",
        "warning_period_months",
        "warning_period_days",
        "warning_period_hours",
        "sort_order",
      ];

      if (!allowedFields.includes(field)) {
        throw new Error("Invalid field update");
      }

      return await db.runAsync(
        `UPDATE products SET ${field} = ? WHERE id = ?`,
        [value, productId]
      );
    },

    // =========================
    // Reduce Stock (FEFO)
    // =========================
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
          await db.runAsync(`DELETE FROM stock_items WHERE id = ?`, [batch.id]);
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

    // =========================
    // Delete Product
    // =========================
    deleteProduct: async (productId: number) => {
      return await db.runAsync(`DELETE FROM products WHERE id = ?`, [
        productId,
      ]);
    },

    // =========================
    // Pin / Unpin
    // =========================
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

    // =========================
    // All Batches (Context)
    // =========================
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
        warn_at: fromDbDate(row.warn_at),
        created_at: new Date(row.created_at),
      }));
    },

    // =========================
    // Delete Batch
    // =========================
    deleteBatch: async (batchId: number) => {
      return await db.runAsync(`DELETE FROM stock_items WHERE id = ?`, [
        batchId,
      ]);
    },
  };
};
