// Leqa © 2025 Mithula Chanthuka

export interface Product {
  id: number;
  title: string;
  description: string;
  weight_value: number;
  weight_unit: "g" | "kg";
  price: number;
  image?: string | null;
  total_stock: number;
  do_expire: 0 | 1;
  shelf_life_years: number | null;
  shelf_life_months: number | null;
  shelf_life_days: number | null;
  shelf_life_hours: number | null;
  do_warn: 0 | 1;
  warning_period_months: number | null;
  warning_period_days: number | null;
  warning_period_hours: number | null;
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
