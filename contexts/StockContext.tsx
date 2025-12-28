// Leqa © 2025 Mithula Chanthuka

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { stockController } from "@/db/stockController";
import { Product } from "@/types/stock";

interface StockContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  reorderProducts: (newOrder: Product[]) => Promise<void>;
  loading: boolean;
  controller: ReturnType<typeof stockController>; 
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useSQLiteContext();

  const controller = useMemo(() => stockController(db), [db]);

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

  const reorderProducts = async (newOrder: Product[]) => {
    setProducts(newOrder); // Optimistic UI update
    try {
      const mappedOrders = newOrder.map((p, index) => ({
        id: p.id,
        position: index,
      }));
      await controller.updateSortOrder(mappedOrders);
    } catch (err) {
      console.error("Failed to save order", err);
      refreshProducts(); // Revert on error
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <StockContext.Provider
      value={{ 
        products, 
        refreshProducts, 
        reorderProducts, 
        loading, 
        controller
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error("useStock must be used within StockProvider");
  return context;
};