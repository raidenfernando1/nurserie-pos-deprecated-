import { create } from "zustand";
import type { CreateProductInput } from "@/types/product";

interface ProductStore {
  products: CreateProductInput[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: CreateProductInput[]) => void;
  removeProduct: (sku: string) => void;
  updateProduct: (sku: string, updates: Partial<CreateProductInput>) => void;
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
  updateProduct: (sku: string, updates: Partial<CreateProductInput>) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.sku === sku ? { ...p, ...updates } : p,
      ),
    })),
}));
