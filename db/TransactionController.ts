// Leqa © 2026 Mithula Chanthuka

import { SQLiteDatabase } from "expo-sqlite";
import { Transaction, StockLog } from "@/types/customer";

export class TransactionController {
  private db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async createTransaction(
    type: "sale" | "expense" | "other_income",
    amount: number,
    category: string,
    description: string | null = null,
    customerId: number | null = null
  ) {
    return await this.db.runAsync(
      `INSERT INTO transactions (type, amount, category, description, customer_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [type, amount, category, description, customerId]
    );
  }

  /**
   * Fetch all transactions with customer names joined
   */
  async getAllTransactions() {
    return await this.db.getAllAsync<
      Transaction & { customer_name: string | null }
    >(`
      SELECT t.*, c.name as customer_name 
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
    `);
  }

  /**
   * Delete a transaction.
   * Note: Because of ON DELETE CASCADE in your schema,
   * deleting a transaction automatically removes its associated stock_logs.
   */
  async deleteTransaction(id: number) {
    return await this.db.runAsync(`DELETE FROM transactions WHERE id = ?`, [
      id,
    ]);
  }

  /**
   * Edit specific columns dynamically.
   * Usage: editTransaction(5, { amount: 1200, category: 'Utilities' })
   */
  async editTransaction(id: number, updates: Partial<Transaction>) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = [...Object.values(updates), id];

    return await this.db.runAsync(
      `UPDATE transactions SET ${setClause} WHERE id = ?`,
      values
    );
  }

  /**
   * Get filtered transactions (e.g., only 'sale')
   */
  async getTransactionsByType(type: "sale" | "expense" | "other_income") {
    return await this.db.getAllAsync<Transaction>(
      `SELECT * FROM transactions WHERE type = ? ORDER BY created_at DESC`,
      [type]
    );
  }

  /**
   * Get Audit Logs (Stock Reductions)
   */
  async getStockLogs() {
    return await this.db.getAllAsync<StockLog>(`
      SELECT sl.*, p.title as product_title 
      FROM stock_logs sl
      JOIN products p ON sl.product_id = p.id
      ORDER BY sl.created_at DESC
    `);
  }
}
