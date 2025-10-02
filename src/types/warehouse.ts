import { Product } from "@/types/product";

export interface ApiWarehouseResponse {
  success: boolean;
  stock: {
    company_total_stock: number;
    company_total_products: number;
  };
  warehouses: Array<{
    warehouse_id: number;
    warehouse_name: string;
    company_id: number;
    total_stock: string;
    total_products: string;
  }>;
}

export interface WarehouseResponse {
  warehouses: Warehouse[];
  totals: WarehouseStats;
}
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
