// For creating a new product
export interface CreateProductInput {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  image_url?: string;
  description?: string;
}

// types/product.ts
export interface Product {
  id: number;
  brand: string;
  warehouse_id: number;
  product_id: number;
  stock: number;
  stock_threshold: number;
  warehouse_name: string;
  product_name: string;
  product_description: string;
  category: string;
  sku: string;
  barcode: string;
  price: string;
  image_url: string;
}

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
}>;
