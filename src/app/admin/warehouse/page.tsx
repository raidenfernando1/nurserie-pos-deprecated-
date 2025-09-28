"use client";

import React from "react";
import DataCard from "./_component/DataCard";
import WarehouseCarousel from "./_component/WarehouseCarousel";
import useWarehouseStore from "@/store/useWarehouse";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Warehouse() {
  const { warehouses, warehouseStats } = useWarehouseStore();
  return (
    <main className="h-full w-full">
      <div className="grid grid-cols-3 gap-3 p-6">
        <DataCard label="Total warehouse" value={warehouses.length} />
        <DataCard
          label="Total Products"
          value={warehouseStats.company_total_products}
        />
        <DataCard
          label="Total Stock"
          value={warehouseStats.company_total_stock}
        />
        <DataCard
          label="Total Stock"
          value={warehouseStats.company_total_stock}
        />
        <DataCard label="Most active Warehouse" value="Central Hub" />
        <div className="flex flex-col gap-3">
          <WarehouseCarousel warehouses={warehouses} />
          <Button variant="outline" asChild>
            <Link href="/admin/warehouse/total">Total Stock</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
