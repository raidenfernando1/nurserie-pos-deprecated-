import { create } from "zustand";
import type { Product, CreateProductInput } from "@/types/product";

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
}>;

interface ProductStore {
  products: CreateProductInput[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: CreateProductInput[]) => void;
  removeProduct: (sku: string) => void; //

  fetchProduct: (sku: string) => Promise<void>;
  editProduct: (sku: string, updateData: ProductUpdateData) => Promise<Product>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products: CreateProductInput[]) => set({ products }),

  removeProduct: (sku: string) =>
    set((state) => ({
      products: state.products.filter((p) => p.sku !== sku),
    })),

  editProduct: async (
    sku: string,
    updateData: {
      name?: string;
      description?: string;
      brand?: string;
      category?: string;
      price?: number;
      image_url?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/admin/products/${sku}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }
      const updatedProduct = await res.json();

      set((state) => ({
        products: state.products.map((p) =>
          p.sku === sku ? { ...p, ...updatedProduct } : p
        ),
      }));

      return updatedProduct;
    } catch (e: any) {
      console.error("Failed to edit product:", e.message);
      throw e;
    }
  },

  fetchProduct: async (sku: string) => {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(sku)}`);

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
}));
