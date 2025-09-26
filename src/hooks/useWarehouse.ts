import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useWarehouseStore from "@/store/useWarehouse";

interface Warehouse {
  id: number;
  warehouse_name: string;
  company_id: number;
}

async function fetchWarehouses(): Promise<Warehouse[]> {
  const res = await fetch("/api/admin/warehouse");
  if (!res.ok) {
    const { error, message } = await res.json().catch(() => ({}));
    throw new Error(error || message || "Failed to fetch warehouses");
  }
  return res.json();
}

export function useWarehouses(): UseQueryResult<Warehouse[], Error> {
  const setWarehouse = useWarehouseStore((state) => state.setWarehouse);

  return useQuery<Warehouse[], Error>({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
    onSuccess: (data) => {
      setWarehouse(data);
    },
  });
}
