import { create } from "zustand";

export interface Product {
  warehouse_id: number;
  warehouse_name: string;
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_name: string;
  total_stock: number;
  stock_threshold: number;
  variant_price: number;
  variant_sku: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface Variant {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

interface WarehouseStore {
  totalProducts: number; // just a count
  warehouseProducts: Product[];

  // setters
  setTotalProducts: (products: Product[]) => void;
  setWarehouseProducts: (products: Product[]) => void;
}

export const useWarehouse = create<WarehouseStore>((set) => ({
  totalProducts: 0,
  warehouseProducts: [],

  setTotalProducts: (products) =>
    set({ totalProducts: products.reduce((sum, p) => sum + p.total_stock, 0) }),

  setWarehouseProducts: (products) => set({ warehouseProducts: products }),
}));
