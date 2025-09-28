import { Product } from "@/types/product";

export interface Warehouse {
  warehouse_id: number;
  company_id: number;
  warehouse_name: string;
  total_stock: number;
  total_products: number;
}

export interface WarehouseCard {
  id: number;
  name: string;
}

export interface WarehouseStats {
  company_total_stock: number;
  company_total_products: number;
}

export interface WarehouseStore {
  stockCount: number;
  setStockCount: (value: number) => void;

  warehouses: Warehouse[];
  setWarehouses: (value: Warehouse[]) => void;

  warehouseStats: WarehouseStats;
  setWarehouseStats: (value: WarehouseStats) => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
}
