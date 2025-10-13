"use client";

import { useEffect } from "react";
import ReusableTable from "@/components/table/reusable-table";
import { useWarehouseStore } from "@/store/warehouse-store";
import Tab from "../../../components/table/table-tab";
import StatusBadge from "@/components/table/status-badge";
import LoadingBar from "@/components/loading-page";

const columns = [
  {
    id: "product_info",
    header: "Product",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.image_url}
          className="w-12 h-12 object-cover rounded-lg border"
        />
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-col">
            <span className="font-semibold ">{row.original.product_name}</span>
            <StatusBadge
              stock={row.original.stock}
              threshold={row.original.stock_threshold}
            />
          </div>
          {row.original.brand && (
            <span className="text-xs ">{row.original.brand}</span>
          )}
        </div>
      </div>
    ),
    accessorFn: (row: any) => row.product_name,
    filterFn: "includesString" as const,
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {row.original.category || "Uncategorized"}
        </span>
      </div>
    ),
    filterFn: "includesString" as const,
  },

  {
    id: "sku_barcode",
    header: "SKU / Barcode",
    accessorFn: (row: any) => `${row.sku} ${row.barcode}`,
    cell: ({ row }: any) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs ">SKU:</span>
          <span className="font-mono text-sm font-medium ">
            {row.original.sku}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs ">Barcode:</span>
          <span className="font-mono text-sm ">{row.original.barcode}</span>
        </div>
      </div>
    ),
    filterFn: "includesString" as const,
  },

  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }: any) => (
      <div className="flex items-center">{row.original.warehouse_name}</div>
    ),
    filterFn: "includesString" as const,
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => (
      <span className="font-semibold ">
        {row.original.price ? `₱${row.original.price.toLocaleString()}` : "N/A"}
      </span>
    ),
  },

  {
    id: "stock_info",
    header: "Stock Status",
    cell: ({ row }: any) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>Current: </span>
          <span>{row.original.stock}</span>
        </div>
        <div className="flex items-center">
          <span>Threshold: </span>
          <span>{row.original.stock_threshold}</span>
        </div>
      </div>
    ),
    accessorFn: (row: any) => `${row.stock} ${row.stock_threshold}`,
    filterFn: "includesString" as const,
  },
];

const Stocks = () => {
  const { fetchStockedProducts, allStockedProducts, isLoading, error } =
    useWarehouseStore();

  useEffect(() => {
    fetchStockedProducts();
  }, [fetchStockedProducts]);

  const categories = Array.from(
    new Set(
      allStockedProducts.map((product) => product.category).filter(Boolean),
    ),
  );

  const warehouses = Array.from(
    new Set(
      allStockedProducts
        .map((product) => product.warehouse_name)
        .filter(Boolean),
    ),
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
        <h1>All stocked products</h1>
        <div className="flex-1 min-h-0">
          <ReusableTable
            data={allStockedProducts}
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
