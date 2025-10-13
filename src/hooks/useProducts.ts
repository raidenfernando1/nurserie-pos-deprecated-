import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import useWarehouseStore from "@/store/useWarehouse";

async function fetchProducts({
  isFull = true,
}: {
  isFull: boolean;
}): Promise<Product[]> {
  const res = await fetch(`/api/admin/products?full=${isFull}`);
  if (!res.ok) throw new Error("Failed to fetch products");

  const products: Product[] = await res.json();
  return products.map((product) => ({
    ...product,
    stock: Number(product.stock),
    stock_threshold: Number(product.stock_threshold),
  }));
}

async function fetchWarehouseProducts({
  warehouseID,
}: {
  warehouseID: string;
}): Promise<Product[]> {
  const res = await fetch(`/api/admin/warehouse/${warehouseID}/products`);
  if (!res.ok) throw new Error("Failed to fetch warehouse products");
  return res.json();
}

async function createWarehouseProduct(productData: any): Promise<any> {
  const res = await fetch(`/api/admin/warehouse/${warehouseID}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...productData,
      warehouse_id: warehouseID,
    }),
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}

export function useWarehouseProducts({ warehouseID }: { warehouseID: string }) {
  return useQuery<Product[], Error>({
    queryKey: ["warehouseProducts", warehouseID],
    queryFn: () => fetchWarehouseProducts({ warehouseID }),
    enabled: warehouseID !== undefined,
  });
}

export function useProducts(isFull: boolean = true) {
  const { setStockCount } = useWarehouseStore();
  const setProducts = useWarehouseStore((state) => state.setProducts);

  const query = useQuery<Product[], Error>({
    queryKey: ["products", isFull],
    queryFn: () => fetchProducts({ isFull }),
  });

  useEffect(() => {
    if (query.data) {
      setProducts(query.data);
      const totalStock = query.data.reduce((acc, p) => acc + p.stock, 0);
      setStockCount(totalStock);
    }
  }, [query.data, setProducts, setStockCount]);

  return query;
}

export { createWarehouseProduct };
