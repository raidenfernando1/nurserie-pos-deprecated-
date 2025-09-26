"use client";

import React, { useEffect } from "react";
import DataCard from "./DataCard";
import useWarehouseStore from "@/store/useWarehouse";
import { useWarehouses } from "@/hooks/useWarehouse";

export default function WarehouseContainer() {
  const { stockCount, warehouse, setWarehouse } = useWarehouseStore();
  const { data: warehouses } = useWarehouses();

  useEffect(() => {
    if (warehouses) {
      setWarehouse(warehouses);
    }
  }, [warehouses, setWarehouse]);

  return (
    <main className="w-full flex flex-col gap-6 z-15">
      <div className="w-full flexgap-6">
        <div className=" flex min-w-3/4 gap-6">
          <DataCard label="Warehouses" value={warehouse?.length ?? 0} />
          <DataCard label="Stock" value={stockCount} />
        </div>
      </div>
    </main>
  );
}
