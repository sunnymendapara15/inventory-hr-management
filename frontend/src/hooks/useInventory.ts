import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type Status = "idle" | "loading" | "success" | "error";

export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  location?: string;
  quantity: number;
}

export type InventoryInput = Omit<InventoryItem, "id">;

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { data } = await axios.get<InventoryItem[]>(`${API_BASE}/items`);
      setItems(data);
      setStatus("success");
      return data;
    } catch (err) {
      console.error(err);
      setError("Unable to load inventory.");
      setStatus("error");
      return [];
    }
  }, []);

  const addItem = useCallback(async (payload: InventoryInput) => {
    setStatus("loading");
    setError(null);
    try {
      const { data } = await axios.post<InventoryItem>(`${API_BASE}/items`, payload);
      setItems((prev) => {
        const updated = prev.filter((item) => item.id !== data.id && item.name !== payload.name);
        return [...updated, data];
      });
      setStatus("success");
      return data;
    } catch (err) {
      console.error(err);
      setError("Unable to save inventory.");
      setStatus("error");
      throw err;
    }
  }, []);

  const reload = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    status,
    error,
    addItem,
    reload,
  };
};
