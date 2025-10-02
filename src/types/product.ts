export interface Product {
  id: number;
  name: string;
  price: number;
  stock_threshold: number;
  sku: string;
  stock: number;
  company_id?: number;
  description?: string;
  image_url?: string;
  barcode: number;
  brand: string;
  category: string;
  warehouse_name: string;
}
