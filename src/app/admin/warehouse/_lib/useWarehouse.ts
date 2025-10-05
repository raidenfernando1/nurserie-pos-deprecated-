import { create } from "zustand";

export interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
  company_id: number;
  total_stock: number;
  total_products: number;
}

export interface WarehouseStats {
  company_total_stock: number;
  company_total_products: number;
  total_warehouses: number;
  average_stock_per_warehouse: number;
  most_stocked_warehouse?: Warehouse;
  least_stocked_warehouse?: Warehouse;
}

export interface Product {
  warehouse_product_id: number;
  product_id: number;
  name: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  price: number;
  image_url: string;
  stock: number;
  stock_threshold: number;
}

export interface WarehouseResponse {
  warehouses: Warehouse[];
  totals: WarehouseStats;
}

interface WarehouseState {
  warehouses: Warehouse[];
  totals: WarehouseStats;
  warehouseProducts: Product[];
  selectedWarehouse: { id: number; warehouse_name: string } | null;
  isLoading: boolean;
  error: string | null;

  fetchWarehouses: () => Promise<void>;
  fetchWarehouseProducts: (warehouseID: number) => Promise<void>;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setWarehouseStats: (totals: WarehouseStats) => void;
  setStockCount: (count: number) => void;
}

const useWarehouse = create<WarehouseState>((set) => ({
  warehouses: [],
  totals: {
    company_total_stock: 0,
    company_total_products: 0,
    total_warehouses: 0,
    average_stock_per_warehouse: 0,
  },
  warehouseProducts: [],
  selectedWarehouse: null,
  isLoading: false,
  error: null,

  fetchWarehouses: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("/api/admin/warehouse");
      if (!res.ok) {
        const { error, message } = await res.json().catch(() => ({}));
        throw new Error(error || message || "Failed to fetch warehouses");
      }

      const data = await res.json();

      const warehouses: Warehouse[] = data.warehouses.map((w: any) => ({
        warehouse_id: w.warehouse_id,
        warehouse_name: w.warehouse_name,
        company_id: w.company_id,
        total_stock: parseInt(w.total_stock),
        total_products: parseInt(w.total_products),
      }));

      const company_total_stock = warehouses.reduce(
        (acc, w) => acc + w.total_stock,
        0
      );
      const company_total_products = warehouses.reduce(
        (acc, w) => acc + w.total_products,
        0
      );
      const total_warehouses = warehouses.length;
      const average_stock_per_warehouse =
        total_warehouses > 0
          ? Math.round(company_total_stock / total_warehouses)
          : 0;

      const most_stocked_warehouse = [...warehouses].sort(
        (a, b) => b.total_stock - a.total_stock
      )[0];
      const least_stocked_warehouse = [...warehouses].sort(
        (a, b) => a.total_stock - b.total_stock
      )[0];

      const totals: WarehouseStats = {
        company_total_stock,
        company_total_products,
        total_warehouses,
        average_stock_per_warehouse,
        most_stocked_warehouse,
        least_stocked_warehouse,
      };

      set({
        warehouses,
        totals,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Something went wrong",
        isLoading: false,
      });
    }
  },

  fetchWarehouseProducts: async (warehouseID: number) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`/api/admin/warehouse/${warehouseID}/products`);
      if (!res.ok) throw new Error("Failed to fetch warehouse products");

      const data = await res.json();

      set({
        warehouseProducts: data.products || [],
        selectedWarehouse: data.warehouse || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Something went wrong",
        isLoading: false,
      });
    }
  },

  setWarehouses: (warehouses) => set({ warehouses }),
  setWarehouseStats: (totals) => set({ totals }),
  setStockCount: (count) =>
    set((state) => ({
      totals: { ...state.totals, company_total_stock: count },
    })),
}));

export default useWarehouse;
