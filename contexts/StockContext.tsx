// Leqa © 2025 Mithula Chanthuka

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import { stockController } from "@/db/stockController";
import { Product, StockItem } from "@/types/stock";
import { Customer } from "@/types/customer";

interface StockContextType {
  products: Product[];
  customers: Customer[];
  batches: StockItem[];
  refreshProducts: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  loading: boolean;
  controller: ReturnType<typeof stockController>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();

  const controller = useMemo(() => stockController(db), [db]);

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [batches, setBatches] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCustomers = async () => {
    try {
      const [customerData] = await Promise.all([controller.getAllCustomers()]);

      setCustomers(customerData);
    } catch (err) {
      console.error("Failed to fetch Customer data", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      const [productData, customerData, batchData] = await Promise.all([
        controller.getAllProducts(),
        controller.getAllCustomers(),
        controller.getAllBatches(),
      ]);

      setProducts(productData);
      setCustomers(customerData);
      setBatches(batchData);
    } catch (err) {
      console.error("Failed to fetch stock data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshCustomers();
  }, []);

  return (
    <StockContext.Provider
      value={{
        products,
        customers,
        batches,
        refreshProducts,
        refreshCustomers,
        loading,
        controller,
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
