"use client";

import { columns } from "../_components/table-column";
import { useEffect } from "react";
import { useWarehouseStore } from "@/store/warehouse-store";
import ReusableTable from "@/components/reusable-table";
import Tab from "../_components/table-tab";
import React from "react";

export default function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { fetchWarehouseStock, warehouseSlugStock, isLoading, error } =
    useWarehouseStore();

  useEffect(() => {
    fetchWarehouseStock({ warehouseID: id });
  }, []);

  console.log(warehouseSlugStock);

  const categories = Array.from(
    new Set(warehouseSlugStock.map((d) => d.category)),
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold">Error loading products</p>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <div className="flex-1 min-h-0">
        <ReusableTable data={warehouseSlugStock} columns={columns as any} />
      </div>
    </div>
  );
}
