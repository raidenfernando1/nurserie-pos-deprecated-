import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "@/app/types/products";

async function fetchProducts(): Promise<ProductType[]> {
  const res = await fetch("/api/admin/warehouse/products");

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const jsonResponse: ProductType[] = await res.json();

  return jsonResponse.map((product) => ({
    ...product,
    total_stock: Number(product.total_stock),
    stock_threshold: Number(product.stock_threshold),
    variant_price: Number(product.variant_price),
  }));
}

export function useProducts() {
  return useQuery<ProductType[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    refetchInterval: 5000, // re fetches every 5 seconds this is in milliseconds :)
  });
}
