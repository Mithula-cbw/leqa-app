// Leqa © 2025 Mithula Chanthuka

// --- Customer Types ---
export interface Customer {
  id: number;
  image?: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  is_pinned: 0 | 1;
  created_at: string;
}

// --- Transaction Types ---
// Defines the nature of the financial movement
export type TransactionType = 'sale' | 'expense' | 'other_income';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string | null;
  customer_id: number | null; // Linked if type is 'sale'
  created_at: string;
}

// --- Stock Audit Logs ---
// Tracks why items left the inventory
export type ReductionReason = 'sale' | 'expired' | 'waste' | 'silent';

export interface StockLog {
  id: number;
  product_id: number;
  quantity: number;
  reason: ReductionReason;
  transaction_id: number | null; // Linked if reason is 'sale'
  created_at: string;
}

// --- Summaries (For Dashboards) ---
export interface BusinessSummary {
  totalSales: number;
  totalExpenses: number;
  totalOtherIncome: number;
  netProfit: number;
  stockLossQuantity: number; // Sum of 'expired' + 'waste'
}