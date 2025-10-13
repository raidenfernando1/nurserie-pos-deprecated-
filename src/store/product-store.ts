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

type ProductUpdateData = Partial<{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
}>;

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  createProduct: (data: CreateProductInput) => Promise<void>;
  fetchAllProducts: (isFull?: boolean) => Promise<Product[]>;
  deleteProduct: (
    sku: string,
    isGlobal?: boolean,
    warehouseId?: string,
  ) => Promise<void>;
  fetchProduct: (sku: string) => Promise<void>;
  editProduct: (sku: string, updateData: ProductUpdateData) => Promise<Product>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  editProduct: async (
    sku: string,
    updateData: {
      name?: string;
      description?: string;
      brand?: string;
      category?: string;
      price?: number;
      image_url?: string;
    },
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

      // Update the product in the store
      set((state) => ({
        products: state.products.map((p) =>
          p.sku === sku ? { ...p, ...updatedProduct } : p,
        ),
      }));

      return updatedProduct;
    } catch (e: any) {
      console.error("Failed to edit product:", e.message);
      throw e;
    }
  },

  deleteProduct: async (
    sku: string,
    isGlobal = false,
    warehouseId?: string,
  ) => {
    try {
      const query = new URLSearchParams();
      if (isGlobal) query.append("isGlobal", "");
      if (!isGlobal && warehouseId) query.append("warehouseId", warehouseId);

      const res = await fetch(
        `/api/admin/products/${sku}?${query.toString()}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }

      const result = await res.json();

      return result;
    } catch (e) {
      console.error("❌ Failed to delete product:", e);
      throw e;
    }
  },

  createProduct: async ({
    name,
    description = null,
    brand = "none",
    category,
    sku,
    barcode,
    price = 0,
    image_url,
  }: {
    name: string;
    description?: string | null;
    brand?: string;
    category?: string;
    sku: string;
    barcode: string;
    price?: number;
    image_url?: string;
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to create product (HTTP ${res.status})`,
        );
      }

      // ✅ Backend returns { product: [...] } so unwrap it properly
      const data = await res.json();
      const product = Array.isArray(data.product)
        ? data.product[0]
        : data.product;

      const newProduct = {
        ...product,
        stock: Number(product?.stock ?? 0),
        stock_threshold: Number(product?.stock_threshold ?? 0),
      };

      set((state) => ({
        products: [...state.products, newProduct],
      }));

      return newProduct;
    } catch (e) {
      console.error("❌ Failed to create product:", e);
      throw e;
    }
  },

  fetchProduct: async (sku: string) => {
    try {
      const res = await fetch(
        `/api/admin/warehouse/product?search=${encodeURIComponent(sku)}`,
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch product");
      }

      console.log(res);

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
