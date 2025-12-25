// Leqa © 2025 Mithula Chanthuka
import { Product } from './inventory';

export type FieldType = 'text' | 'number' | 'date';

export interface CustomField {
  label: string;
  type: FieldType;
  value: string | number;
}

export interface FluidProduct extends Product {
  customAttributes: CustomField[];
}