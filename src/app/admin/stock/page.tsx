"use client";

import { useEffect } from "react";
import ReusableTable from "@/components/table/reusable-table";
import Tab from "@/components/table/table-tab";
import LoadingBar from "@/components/loading-page";
import { columns } from "./_table/columns";
import { useWarehouseStore } from "@/store/warehouse-store";

const Stocks = () => {
  const { fetchStockedProducts, stockedProducts, error } = useWarehouseStore();

  useEffect(() => {
    fetchStockedProducts();
  }, []);

  const categories = Array.from(
    new Set(stockedProducts.map((p) => p.category).filter(Boolean)),
  );

  const warehouses = Array.from(
    new Set(stockedProducts.map((p) => p.warehouse_name).filter(Boolean)),
  );

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
    <LoadingBar>
      <div className="h-screen p-3 flex flex-col gap-3">
        <h1 className="text-lg font-semibold">All stocked products</h1>
        <div className="flex-1 min-h-0">
          <ReusableTable
            data={stockedProducts}
            columns={columns as any}
            tabComponent={(table) => (
              <Tab
                table={table}
                filters={[
                  {
                    columnId: "category",
                    label: "Categories",
                    options: categories,
                    placeholder: "All Categories",
                  },
                  {
                    columnId: "warehouse_name",
                    label: "Warehouses",
                    options: warehouses,
                    placeholder: "All Warehouses",
                  },
                ]}
              />
            )}
          />
        </div>
      </div>
    </LoadingBar>
  );
};

export default Stocks;
