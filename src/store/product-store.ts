import { create } from "zustand";
import type { Product } from "@/types/product";

export type CreateProductInput = {
  name: string;
  description: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  price: number;
  image_url: string;
};

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  createProduct: (data: CreateProductInput) => Promise<void>;
  fetchAllProducts: (isFull?: boolean) => Promise<Product[]>;
  deleteProduct: (
    sku: string,
    isGlobal?: boolean,
    warehouseId?: string
  ) => Promise<void>;
  fetchProduct: (sku: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  deleteProduct: async (
    sku: string,
    isGlobal = false,
    warehouseId?: string
  ) => {
    try {
      const query = new URLSearchParams();
      if (isGlobal) query.append("isGlobal", "");
      if (!isGlobal && warehouseId) query.append("warehouseId", warehouseId);

      const res = await fetch(
        `/api/admin/products/${sku}?${query.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }

      const result = await res.json();
      console.log("✅ Product deleted:", result);

      return result;
    } catch (e) {
      console.error("❌ Failed to delete product:", e);
      throw e;
    }
  },

  createProduct: async ({
    name,
    description = null,
    brand,
    category,
    sku,
    barcode,
    price = 0,
    image_url,
  }) => {
    try {
      const res = await fetch(`/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          brand,
          category,
          sku,
          barcode,
          price,
          image_url,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || !result?.id) {
        throw new Error(
          result.error || `Failed to create product (status: ${res.status})`
        );
      }

      set((state) => ({
        products: [...state.products, result],
      }));

      return result;
    } catch (e) {
      console.error("❌ Failed to create product:", e);
      throw e;
    }
  },

  fetchProduct: async (sku: string) => {
    try {
      const res = await fetch(
        `/api/admin/warehouse/product?search=${encodeURIComponent(sku)}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch product");
      }

      const product = await res.json();
      return product;
    } catch (e) {
      console.error;
    }
  },

  fetchAllProducts: async (isFull = true) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`/api/admin/products?full=${isFull}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: Product[] = await res.json();

      const products = data.map((product) => ({
        ...product,
        stock: Number(product.stock),
        stock_threshold: Number(product.stock_threshold),
      }));

      console.log(products);
      set({ products, isLoading: false });

      return products;
    } catch (err: any) {
      set({ error: err.message || "Unknown error", isLoading: false });
      return [];
    }
  },
}));
