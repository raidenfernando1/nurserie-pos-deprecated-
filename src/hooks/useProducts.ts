import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/store/useWarehouse";
import useWarehouseStore from "@/store/useWarehouse";

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/warehouse/products");

  if (!res.ok) throw new Error("Failed to fetch products");

  const jsonResponse: Product[] = await res.json();

  return jsonResponse.map((product) => ({
    ...product,
    total_stock: Number(product.stock),
    stock_threshold: Number(product.stock_threshold),
  }));
}

export function useProducts() {
  const setProducts = useWarehouseStore((state) => state.setProducts);

  const query = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (query.data) {
      setProducts(query.data);
    }
  }, [query.data, setProducts]);

  return query;
}
