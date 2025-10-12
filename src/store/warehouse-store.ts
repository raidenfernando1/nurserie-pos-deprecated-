import { create } from "zustand";
import type { Product } from "@/types/product";

interface WarehouseDataProps {
  id: string;
  warehouse_name: string;
  products: Product[];
}

interface WarehouseState {
  allStockedProducts: Product[];
  warehouseSlugStock: WarehouseDataProps[];
  isLoading: boolean;
  error: string | null;
  fetchStockedProducts: () => Promise<Product[]>;
  fetchWarehouseStock: (warehouseID: string) => Promise<void>;
}

export const useWarehouseStore = create<WarehouseState>((set) => ({
  allStockedProducts: [],
  warehouseSlugStock: [],
  isLoading: false,
  error: null,

  fetchWarehouseStock: async (warehouseID) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`/api/admin/warehouse/${warehouseID}`);
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }

      const data: WarehouseDataProps = await res.json();

      set({
        warehouseSlugStock: [data],
        isLoading: false,
        error: null,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },

  fetchStockedProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("/api/admin/warehouse/products");
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }

      const data: Product[] = await res.json();

      const allStockedProducts = data.map((p) => ({
        ...p,
        stock: Number(p.stock),
        stock_threshold: Number(p.stock_threshold),
      }));

      set({ allStockedProducts, isLoading: false });
      return allStockedProducts;
    } catch (e: any) {
      console.error("❌ Failed to fetch stocked products:", e);
      set({ error: e.message || "Unknown error", isLoading: false });
      return [];
    }
  },
}));
