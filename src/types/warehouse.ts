import { Product } from "@/types/product";

export interface WarehouseStore {
  stockCount: number;
  setStockCount: (value: number) => void;
  warehouse: any[];
  setWarehouse: (value: any[]) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}
