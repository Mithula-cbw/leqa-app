// Leqa © 2025 Mithula Chanthuka
export enum BatchStatus {
  AVAILABLE = 'Available',
  EXPIRED = 'Expired',
  WASTE = 'Waste'
}

export interface InventoryBatch {
  id: number;
  product_id: number;
  quantity_added: number;
  quantity_remaining: number;
  created_at: string;
  expiry_date: string | null;
  status: BatchStatus;
}

export interface Product {
  id: number;
  template_id: number;
  name: string;
  base_price: number;
  alert_low_stock: number;
}