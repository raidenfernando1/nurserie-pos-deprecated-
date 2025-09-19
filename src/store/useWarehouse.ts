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
