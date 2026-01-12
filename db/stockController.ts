// Leqa © 2025 Mithula Chanthuka

import { ReductionReason } from "@/types/customer";
import { Product, StockItem } from "@/types/stock";
import { SQLiteDatabase } from "expo-sqlite";

// Helpers
const toDbDate = (date: Date | null): string | null =>
  date ? date.toISOString() : null;

const fromDbDate = (value: string | null): Date | null =>
  value ? new Date(value) : null;

export const stockController = (db: SQLiteDatabase) => {
  /**
   * Internal FEFO Logic (First Expired, First Out)
   * Used by both the simple reduce and the logic-heavy reduce.
   */
  const internalReduceStock = async (
    productId: number,
    amountToReduce: number
  ) => {
    const batches = await db.getAllAsync<any>(
      `SELECT id, quantity FROM stock_items WHERE product_id = ? ORDER BY expiry_at ASC`,
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
          `UPDATE stock_items SET quantity = quantity - ? WHERE id = ?`,
          [remaining, batch.id]
        );
        remaining = 0;
      }
    }
    return remaining === 0;
  };

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
      const existing = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM products WHERE LOWER(TRIM(title)) = LOWER(TRIM(?)) AND weight_value = ? AND weight_unit = ? AND price = ?`,
        [title, weight_value, weight_unit, price]
      );

      if (existing) throw new Error(`Product "${title}" already exists.`);

      return await db.runAsync(
        `INSERT INTO products (title, description, weight_value, weight_unit, image, price, do_expire, shelf_life_years, shelf_life_months, shelf_life_days, shelf_life_hours, do_warn, warning_period_months, warning_period_days, warning_period_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    // Stock Management
    // =========================
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
        `INSERT INTO stock_items (product_id, batch_number, quantity, expiry_at, warn_at) VALUES (?, ?, ?, ?, ?)`,
        [productId, batchNumber, quantity, toDbDate(expiryAt), toDbDate(warnAt)]
      );
    },

    getAllProducts: async (): Promise<Product[]> => {
      return await db.getAllAsync<Product>(
        `SELECT p.*, COALESCE(SUM(s.quantity), 0) AS total_stock FROM products p LEFT JOIN stock_items s ON p.id = s.product_id GROUP BY p.id ORDER BY p.is_pinned DESC, total_stock DESC, p.title ASC`
      );
    },

    getProductBatches: async (productId: number): Promise<StockItem[]> => {
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM stock_items WHERE product_id = ? ORDER BY expiry_at ASC`,
        [productId]
      );
      return rows.map((row) => ({
        ...row,
        expiry_at: fromDbDate(row.expiry_at),
        warn_at: fromDbDate(row.warn_at),
        created_at: new Date(row.created_at),
      }));
    },

    // =========================
    // Selling & Reducing Logic
    // =========================
    reduceStockWithLogic: async (
      productId: number,
      amount: number,
      reason: ReductionReason,
      metadata?: { price?: number; customerId?: number; note?: string }
    ) => {
      await db.execAsync("BEGIN TRANSACTION");

      try {
        /* 1️⃣ Physical reduction (FEFO) */
        const success = await internalReduceStock(productId, amount);
        if (!success) throw new Error("Insufficient stock.");

        let transactionId: number | null = null;

        /* 2️⃣ Financial record (only for sales) */
        if (reason === "sale") {
          const salePrice = metadata?.price ?? 0;
          const totalAmount = amount * salePrice;

          const result = await db.runAsync(
            `INSERT INTO transactions (type, category, amount, customer_id, description)
         VALUES (?, ?, ?, ?, ?)`,
            [
              "sale",
              "Direct Sale",
              totalAmount,
              metadata?.customerId ?? null,
              metadata?.note ?? `Sold ${amount} units`,
            ]
          );

          transactionId = result.lastInsertRowId;
        }

        /* 3️⃣ Audit log (skip silent) */
        if (reason !== "silent") {
          await db.runAsync(
            `INSERT INTO stock_logs (product_id, quantity, reason, transaction_id)
         VALUES (?, ?, ?, ?)`,
            [productId, amount, reason, transactionId]
          );
        }

        /* 4️⃣ Commit ALL changes */
        await db.execAsync("COMMIT");
        return true;
      } catch (error) {
        /* ❌ Roll back EVERYTHING */
        await db.execAsync("ROLLBACK");
        throw error;
      }
    },

    addFinancialRecord: async (
      type: "expense" | "other_income",
      amount: number,
      category: string,
      description: string
    ) => {
      return await db.runAsync(
        `INSERT INTO transactions (type, amount, category, description) VALUES (?, ?, ?, ?)`,
        [type, amount, category, description]
      );
    },

    // =========================
    // Field Updates
    // =========================
    updateProductField: async (
      productId: number,
      field: string,
      value: any
    ) => {
      return await db.runAsync(
        `UPDATE products SET ${field} = ? WHERE id = ?`,
        [value, productId]
      );
    },

    updateProductFields: async (
      productId: number,
      updates: Record<string, any>
    ) => {
      const fields = Object.keys(updates);
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      return await db.runAsync(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        [...Object.values(updates), productId]
      );
    },

    updateAllBatchesForProduct: async (
      productId: number,
      updates: Record<string, any>
    ) => {
      const fields = Object.keys(updates).filter(
        (f) => f !== "id" && f !== "product_id"
      );
      if (fields.length === 0) return;
      const dbValues = fields.map((f) =>
        updates[f] instanceof Date ? toDbDate(updates[f]) : updates[f]
      );
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      return await db.runAsync(
        `UPDATE stock_items SET ${setClause} WHERE product_id = ?`,
        [...dbValues, productId]
      );
    },

    // =========================
    // Customer Management
    // =========================

    createCustomer: async (
      name: string,
      image: string | null,
      phone: string | null,
      email: string | null
    ) => {
      return await db.runAsync(
        `INSERT INTO customers (name, image, phone, email) VALUES (?, ?, ?, ?)`,
        [name, image, phone, email]
      );
    },

    getAllCustomers: async () => {
      return await db.getAllAsync<any>(
        `SELECT * FROM customers 
     ORDER BY is_pinned DESC, name ASC`
      );
    },

    // =========================
    // Customer Specific Updates
    // =========================
    updateCustomerField: async (
      customerId: number,
      field: string,
      value: any
    ) => {
      const allowedFields = ["name", "image", "phone", "email", "is_pinned"];
      if (!allowedFields.includes(field)) {
        throw new Error(`Field ${field} is not editable.`);
      }

      return await db.runAsync(
        `UPDATE customers SET ${field} = ? WHERE id = ?`,
        [value, customerId]
      );
    },

    getProductById: async (id: number): Promise<Product | null> => {
      return await db.getFirstAsync<Product>(
        `SELECT p.*, COALESCE(SUM(s.quantity), 0) AS total_stock 
     FROM products p 
     LEFT JOIN stock_items s ON p.id = s.product_id 
     WHERE p.id = ?
     GROUP BY p.id`,
        [id]
      );
    },

    /**
     * Updates multiple fields at once
     * Usage: updateCustomerFields(1, { name: 'John', email: 'john@me.com' })
     */
    updateCustomerFields: async (
      customerId: number,
      updates: Record<string, any>
    ) => {
      const fields = Object.keys(updates);
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = Object.values(updates);

      return await db.runAsync(
        `UPDATE customers SET ${setClause} WHERE id = ?`,
        [...values, customerId]
      );
    },

    toggleCustomerPin: async (id: number, pin: boolean) =>
      await db.runAsync(`UPDATE customers SET is_pinned = ? WHERE id = ?`, [
        pin ? 1 : 0,
        id,
      ]),

    deleteCustomer: async (id: number) => {
      // Warning: You might want to check if they have transactions first
      // or set transaction customer_id to NULL on delete.
      return await db.runAsync(`DELETE FROM customers WHERE id = ?`, [id]);
    },

    // =========================
    // Deletions
    // =========================
    deleteProduct: async (id: number) =>
      await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]),
    deleteBatch: async (id: number) =>
      await db.runAsync(`DELETE FROM stock_items WHERE id = ?`, [id]),
    togglePin: async (id: number, pin: boolean) =>
      await db.runAsync(`UPDATE products SET is_pinned = ? WHERE id = ?`, [
        pin ? 1 : 0,
        id,
      ]),
  };
};
