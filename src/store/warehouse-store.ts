import { create } from "zustand";
import type {
  Warehouse,
  WarehouseWithProducts,
  WarehouseStats,
  AddProductToWarehousePayload,
  WarehouseStore as WarehouseStoreType,
} from "@/types/warehouse";
import type { Product } from "@/types/product";

// note you changed this types - raiden
// ai written beware

export const useWarehouseStore = create<WarehouseStoreType>((set) => ({
  warehouses: [],
  warehouseProducts: [],
  stockedProducts: [],
  stats: null,
  isLoading: false,
  error: null,

  setWarehouses: (warehouses) => set({ warehouses }),
  setWarehouseProducts: (data) => set({ warehouseProducts: data }),
  setStats: (stats) => set({ stats }),

  // Fetch all warehouses
  fetchWarehouses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/admin/warehouse");
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();

      const warehouses: Warehouse[] = data.warehouses.map((w: any) => ({
        id: w.warehouse_id,
        companyId: w.company_id,
        name: w.warehouse_name,
        totalStock: Number(w.total_stock),
        totalProducts: Number(w.total_products),
      }));

      const stats: WarehouseStats = {
        companyTotalStock: data.stock.company_total_stock,
        companyTotalProducts: data.stock.company_total_products,
      };

      console.log({ warehouses, stats, isLoading: false });
      set({ warehouses, stats, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // Fetch specific warehouse stock + products
  fetchWarehouseProducts: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/admin/warehouse/${warehouseId}`);
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      const warehouseProducts: WarehouseWithProducts[] = [
        {
          id: String(data.id ?? data.warehouse_id),
          name: data.name ?? data.warehouse_name,
          products: data.products || [],
        },
      ];

      set({ warehouseProducts, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  // Add product to warehouse
  addProductToWarehouse: async (payload: AddProductToWarehousePayload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/admin/warehouse/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();

      // Assuming API returns the updated warehouse object with products
      set((state) => ({
        warehouseProducts: [...state.warehouseProducts, data.data],
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
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

      set({ stockedProducts: data, isLoading: false });
      return data;
    } catch (e: any) {
      console.error("❌ Failed to fetch stocked products:", e);
      set({ error: e.message || "Unknown error", isLoading: false });
      return [];
    }
  },
}));
