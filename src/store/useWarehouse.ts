import { create } from "zustand";
import type { WarehouseStore } from "@/types/warehouse";

const useWarehouseStore = create<WarehouseStore>((set) => ({
  stockCount: 0,
  setStockCount: (value) => set({ stockCount: value }),
  warehouse: 0,
  setWarehouse: (value) => set({ warehouse: value }),
  products: [],
  setProducts: (products) => set({ products }),
}));

export default useWarehouseStore;
