"use client";

import { useEffect } from "react";
import ReusableTable from "@/components/reusable-table";
import { useWarehouseStore } from "@/store/warehouse-store";
import Tab from "./_components/table-tab";
import { columns } from "./_components/table-column";

const Warehouse = () => {
  const { fetchStockedProducts, allStockedProducts, isLoading, error } =
    useWarehouseStore();

  useEffect(() => {
    fetchStockedProducts();
  }, [fetchStockedProducts]);

  const warehouses = Array.from(
    new Set(allStockedProducts.map((product) => product.warehouse_name)),
  );

  const categories = Array.from(
    new Set(allStockedProducts.map((d) => d.category)),
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
        <ReusableTable
          data={allStockedProducts}
          columns={columns as any}
          tabComponent={(table) => (
            <Tab
              table={table}
              warehouses={warehouses}
              categories={categories}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Warehouse;
