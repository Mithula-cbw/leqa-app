// Leqa © 2025 Mithula Chanthuka

export interface Product {
  id: number;
  title: string;
  description: string;
  weight: string;
  price: number;
  image?: string | null;
  total_stock: number;
  default_shelf_life?: number | null;
}

export interface StockItem {
  id: number;
  product_id: number;
  quantity: number;
  expiry_date: string;
  created_at: string;
}