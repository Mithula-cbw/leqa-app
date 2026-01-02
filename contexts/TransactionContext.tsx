// Leqa © 2025 Mithula Chanthuka

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TransactionController } from "@/db/TransactionController";
import { Transaction, StockLog } from "@/types/customer";

interface TransactionContextProps {
  transactions: Transaction[];
  stockLogs: StockLog[];
  loading: boolean;
  refreshTransactions: () => Promise<void>;
  controller: TransactionController;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize the controller with the DB instance
  const controller = new TransactionController(db);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const [tData, sData] = await Promise.all([
        controller.getAllTransactions(),
        controller.getStockLogs(),
      ]);
      setTransactions(tData);
      setStockLogs(sData);
    } catch (error) {
      console.error("Failed to fetch transaction data:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        stockLogs,
        loading,
        refreshTransactions,
        controller,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};