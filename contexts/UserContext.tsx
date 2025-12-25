// Leqa © 2025 Mithula Chanthuka

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  saveUser: (name: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const db = SQLite.useSQLiteContext();

  useEffect(() => {
    async function loadInitialData() {
      try {
        const firstRow = await db.getFirstAsync<User>('SELECT * FROM users LIMIT 1');
        if (firstRow) setUser(firstRow);
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [db]);

  const saveUser = async (name: string) => {
    try {
      await db.runAsync('DELETE FROM users'); 
      
      const result = await db.runAsync('INSERT INTO users (name) VALUES (?)', [name]);
      
      setUser({ 
        id: result.lastInsertRowId, 
        name 
      });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async () => {
    await db.runAsync('DELETE FROM users');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, saveUser, deleteUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};