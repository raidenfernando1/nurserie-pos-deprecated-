import { create } from "zustand";
import { WarehouseStore } from "@/types/warehouse";

const useWarehouseStore = create<WarehouseStore>((set) => ({
  stockCount: 0,
  setStockCount: (value) => set({ stockCount: value }),

  warehouses: [],
  setWarehouses: (value) => set({ warehouses: value }),

  warehouseStats: { company_total_stock: 0, company_total_products: 0 },
  setWarehouseStats: (value) => set({ warehouseStats: value }),

  products: [],
  setProducts: (products) => set({ products }),
}));

export default useWarehouseStore;
