"use client";

import React from "react";

type Warehouse = {
  id: number;
  company_id: number;
  warehouse_name: string;
  total_stock: string;
};

export default function WarehouseContainer() {
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function fetchWarehouse() {
    const response = await fetch("/api/admin/warehouse", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch warehouse");
    return response.json();
  }

  React.useEffect(() => {
    async function load() {
      try {
        const data = await fetchWarehouse();
        setWarehouses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <main>Loading…</main>;

  return (
    <main className="flex flex-col">
      {warehouses.map((w) => {
        return (
          <>
            <p>{w.total_stock}</p>
            <a href={`/admin/warehouse/${w.id}`}>{w.warehouse_name}</a>
          </>
        );
      })}
    </main>
  );
}
