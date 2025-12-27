// Leqa © 2025 Mithula Chanthuka

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SQLite from "expo-sqlite";
import { User } from "@/types/user";

interface UserContextType {
  user: User | null;
  saveUser: (name: string, image?: string | null) => Promise<void>;
  deleteUser: () => Promise<void>;
  updateProfilePicture: (image: string) => Promise<void>;
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
        const firstRow = await db.getFirstAsync<User>(
          "SELECT * FROM users LIMIT 1"
        );
        if (firstRow) setUser(firstRow);
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [db]);

  const saveUser = async (name: string, image: string | null = null) => {
    try {
      await db.runAsync("DELETE FROM users");
      const result = await db.runAsync(
        "INSERT INTO users (name, image) VALUES (?, ?)",
        [name, image]
      );
      setUser({ id: result.lastInsertRowId, name, image });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async () => {
    try {
      await db.runAsync("DELETE FROM users");

      setUser(null);

      console.log("User data cleared successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateProfilePicture = async (uri: string) => {
    if (!user || user.id === undefined) return;

    try {
      await db.runAsync("UPDATE users SET image = ? WHERE id = ?", [
        uri,
        user.id,
      ]);

      setUser((prev) => (prev ? { ...prev, image: uri } : null));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, saveUser, deleteUser, updateProfilePicture, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
