import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import useWarehouseStore from "@/store/useWarehouse";
import type { Warehouse, WarehouseStats } from "@/types/warehouse";

interface WarehouseResponse {
  warehouses: Warehouse[];
  totals: WarehouseStats;
}

interface ApiWarehouseResponse {
  success: boolean;
  stock: {
    company_total_stock: number;
    company_total_products: number;
  };
  warehouses: Array<{
    warehouse_id: number;
    warehouse_name: string;
    company_id: number;
    total_stock: string;
    total_products: string;
  }>;
}

export async function fetchWarehouses(): Promise<WarehouseResponse> {
  const res = await fetch("/api/admin/warehouse");
  if (!res.ok) {
    const { error, message } = await res.json().catch(() => ({}));
    throw new Error(error || message || "Failed to fetch warehouses");
  }

  const data: ApiWarehouseResponse = await res.json();

  const warehouses: Warehouse[] = data.warehouses.map((w) => ({
    warehouse_id: w.warehouse_id,
    warehouse_name: w.warehouse_name,
    company_id: w.company_id,
    total_stock: parseInt(w.total_stock),
    total_products: parseInt(w.total_products),
  }));

  return {
    warehouses,
    totals: data.stock || { company_total_stock: 0, company_total_products: 0 },
  };
}

export function useWarehouses(): UseQueryResult<WarehouseResponse, Error> {
  const { setWarehouses, setWarehouseStats, setStockCount } =
    useWarehouseStore();

  const query = useQuery<WarehouseResponse, Error>({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
  });

  useEffect(() => {
    if (query.data) {
      setWarehouses(query.data.warehouses);
      setWarehouseStats(query.data.totals);
      setStockCount(query.data.totals.company_total_stock);
    }
  }, [query.data, setWarehouses, setWarehouseStats, setStockCount]);

  return query;
}
