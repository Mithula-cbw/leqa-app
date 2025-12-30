// Leqa © 2025 Mithula Chanthuka

export interface Product {
  id: number;
  title: string;
  description: string;
  weight: string;
  price: number;
  image?: string | null;
  total_stock: number;
  shelf_life_value: number | null;
  shelf_life_unit: "days" | "hours" | "years";
  warning_period_value: number | null;
  warning_period_unit: "days" | "hours" | "years";
  is_pinned: 0 | 1;    
  sort_order: number;
}

export interface StockItem {
  id: number;
  product_id: number;
  batch_number: number;
  quantity: number;
  expiry_at: Date | null;
  warn_at: Date | null;
  created_at: Date;
}