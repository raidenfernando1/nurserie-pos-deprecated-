import { Product } from "@/types/product";

// --- Core Entities ---
export interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
  total_products: string;
  total_stock: string;
  products_in_stock: string;
  low_stock_products: string;
  out_of_stock_products: string;
}

export interface WarehouseStats {
  companyTotalStock: number;
  companyTotalProducts: number;
}

// --- Complex Structures ---
export interface WarehouseWithProducts {
  id: string;
  name: string;
  products: Product[];
}

// --- Payloads ---
export interface AddProductToWarehousePayload {
  warehouseID: string | number;
  sku: string;
  stock: number;
  stock_threshold: number;
}

// --- API Response Types ---
export interface ApiWarehouseResponse {
  success: boolean;
  stock: WarehouseStats;
  warehouses: Array<{
    warehouseID: number;
    warehouse_name: string;
    company_id: number;
    total_stock: string;
    total_products: string;
  }>;
}

// --- Zustand Store ---
export interface WarehouseStore {
  warehouses: Warehouse[];
  warehouseProducts: WarehouseWithProducts[];
  stats: WarehouseStats | null;
  stockedProducts: Product[];

  isLoading: boolean;
  error: string | null;

  // --- Actions ---
  setWarehouses: (warehouses: Warehouse[]) => void;
  setWarehouseProducts: (data: WarehouseWithProducts[]) => void;
  setStats: (stats: WarehouseStats) => void;
  setWarehouse: (warehouse: { id: string; warehouse_name: string }) => void;

  fetchWarehouses: () => Promise<void>;
  fetchWarehouseProducts: (warehouseId: string) => Promise<void>;
  fetchStockedProducts: () => Promise<Product[]>;
  addProductToWarehouse: (
    payload: AddProductToWarehousePayload
  ) => Promise<void>;
}
