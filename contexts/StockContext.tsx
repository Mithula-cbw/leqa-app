// Leqa © 2025 Mithula Chanthuka

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { stockController } from '@/db/stockController';
import { Product } from '@/types/stock';

interface StockContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  loading: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useSQLiteContext();
  const controller = stockController(db);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      const data = await controller.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <StockContext.Provider value={{ products, refreshProducts, loading }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error("useStock must be used within StockProvider");
  return context;
};