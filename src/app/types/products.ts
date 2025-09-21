export interface ProductType {
  product_id: number;
  product_name: string;
  variant_id?: number;
  variant_name?: string;
  total_stock?: number | string;
  stock_threshold?: number | string;
  variant_price?: number;
  variant_sku?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  brand?: string;
  description?: string;
  barcode?: number | string;
  img_url?: string;
  category: string;
}
