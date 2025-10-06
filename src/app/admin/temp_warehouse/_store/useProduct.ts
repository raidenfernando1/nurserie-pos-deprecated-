import { create } from "zustand";
import type { Product } from "@/types/product";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  addProduct: () => Promise<>
  fetchAllProducts: (isFull?: boolean) => Promise<void>;
  fetchProduct: (sku: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  addProduct: async () =>  {

  }

  fetchProduct: async (sku: string) => {
    try {
      const res = await fetch(
        `/api/admin/warehouse/product?search=${encodeURIComponent(sku)}`,
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

      set({ products, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Unknown error", isLoading: false });
    }
  },
}));
