"use client";

import React from "react";
import WarehouseCard from "./WarehouseCard";
import DataCard from "./DataCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useWarehouse } from "@/store/useWarehouse";

export default function WarehouseContainer() {
  const [warehouses, setWarehouses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { totalProducts } = useWarehouse();

  const getWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/warehouse");

      if (!response.ok) {
        const { error, message } = await response.json();
        throw new Error(error || message || "Failed to fetch warehouses");
      }

      const data: any[] = await response.json();
      setWarehouses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getWarehouses();
  }, []);

  const totalWarehouse = warehouses.length;

  if (loading) return <main className="p-4">Loading warehouses...</main>;
  if (error) return <main className="p-4 text-red-600">Error: {error}</main>;
  if (warehouses.length === 0)
    return <main className="p-4">No warehouses found.</main>;

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-xl font-bold mb-4">Warehouse Analytics</h1>

      <div className="grid grid-cols-4 gap-6">
        <DataCard label="Total warehouses" value={totalWarehouse} />
        <DataCard label="Total stock" value={totalProducts} />
        <DataCard label="Total stock" value={3981} />
        <DataCard label="Total stock" value={3981} />
      </div>

      <Carousel className="relative">
        <CarouselContent className="space-x-4 px-8">
          {warehouses.map((w) => (
            <CarouselItem key={w.id} className="w-64 flex-shrink-0">
              <WarehouseCard
                id={w.id}
                name={w.warehouse_name}
                stock={w.total_stock}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10" />
      </Carousel>
    </main>
  );
}
