"use client";

import React from "react";
import DataCard from "./DataCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import useWarehouseStore from "@/store/useWarehouse";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import WarehouseCard from "./WarehouseCard";

export default function WarehouseContainer() {
  const [warehouses, setWarehouses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { warehouseStock, setWarehouseStock, stockCount } = useWarehouseStore();

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

  React.useEffect(() => {
    setWarehouseStock(warehouses.length);
  }, [warehouses, setWarehouseStock]);

  if (error) return <main className="p-4 text-red-600">Error: {error}</main>;
  if (warehouses.length === 0)
    return <main className="p-4">No warehouses found.</main>;

  return (
    <main className="w-full flex flex-col gap-6 z-15">
      <div className="w-full flexgap-6">
        <div className=" flex min-w-3/4 gap-6">
          <DataCard label="Warehouses" value={warehouseStock} />
          <DataCard label="Stock" value={stockCount} />
          <Carousel className="">
            <CarouselContent>
              {warehouses.map((w) => (
                <CarouselItem key={w.id}>
                  <WarehouseCard
                    id={w.id}
                    name={w.warehouse_name}
                    stock={w.total_stock}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10
             h-8 w-8 rounded-full
             bg-black/70 text-white
             flex items-center justify-center
             shadow-md
             transition hover:bg-black/90"
            />

            <CarouselNext
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10
             h-8 w-8 rounded-full
             bg-black/70 text-white
             flex items-center justify-center
             shadow-md
             transition hover:bg-black/90"
            />
          </Carousel>
        </div>
      </div>
    </main>
  );
}
