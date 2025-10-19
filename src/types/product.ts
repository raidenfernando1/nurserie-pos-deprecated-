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

export interface Product {
  id: number;
  name: string;
  price: number;
  stock_threshold?: number; // Optional
  sku: string;
  stock?: number; // Optional
  company_id?: number;
  description?: string;
  image_url?: string | null;
  barcode: string;
  brand: string;
  category: string;
  warehouse_name?: string; // Optional - only present when product is in a warehouse
}

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
}>;
