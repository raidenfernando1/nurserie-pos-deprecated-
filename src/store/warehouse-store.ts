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

  setWarehouse: (warehouse: { id: string; warehouse_name: string }) =>
    set((state) => ({
      warehouses: [
        ...state.warehouses,
        {
          warehouse_id: Number(warehouse.id),
          warehouse_name: warehouse.warehouse_name,
          total_products: "0",
          total_stock: "0",
          products_in_stock: "0",
          low_stock_products: "0",
          out_of_stock_products: "0",
        },
      ],
    })),

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
