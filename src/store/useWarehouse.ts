import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock_threshold: number;
  sku: string;
  company_id: number;
  description: string;
  img_url: string;
  barcode: number;
  brand: string;
  category: string;
}

export interface Variant {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

interface WarehouseStoreTypes {
  stockCount: number;
  setStockCount: (value: number) => void;
  warehouseStock: number;
  setWarehouseStock: (value: number) => void;
}

const useWarehouseStore = create<WarehouseStoreTypes>((set) => ({
  stockCount: 0,
  setStockCount: (value) => set({ stockCount: value }),
  warehouseStock: 0,
  setWarehouseStock: (value) => set({ warehouseStock: value }),
}));

export default useWarehouseStore;
