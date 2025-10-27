"use client";
import ReusableTable from "@/components/product-container";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/table/status-badge";
import Tab from "@/components/table/table-tab";

const columns: ColumnDef<Product>[] = [
  {
    id: "product_info",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image_url ? (
          <img
            src={row.original.image_url}
            className="w-12 h-12 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs border">
            No Image
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-col text-wrap text-left">
            <span className="font-semibold">{row.original.name}</span>
            <StatusBadge
              stock={row.original.stock || 0}
              threshold={row.original.stock_threshold || 0}
            />
          </div>
        </div>
      </div>
    ),
    accessorFn: (row) => row.name,
    filterFn: "includesString" as const,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
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
    accessorFn: (row) => `${row.sku} ${row.barcode}`,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">SKU:</span>
          <span className="font-mono text-sm font-medium">
            {row.original.sku}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">Barcode:</span>
          <span className="font-mono text-sm">{row.original.barcode}</span>
        </div>
      </div>
    ),
    filterFn: "includesString" as const,
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-semibold">
          {row.original.price
            ? `₱${row.original.price.toLocaleString()}`
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "stock_info",
    header: "Stock Status",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>Current: </span>
          <span>{row.original.stock || 0}</span>
        </div>
        <div className="flex items-center">
          <span>Threshold: </span>
          <span>{row.original.stock_threshold || 0}</span>
        </div>
      </div>
    ),
    accessorFn: (row) => `${row.stock} ${row.stock_threshold}`,
    filterFn: "includesString" as const,
  },
];

const InventoryTable = ({ products }: { products: Product[] }) => {
  const warehouses = Array.from(
    new Set(products.map((p) => p.warehouse_name).filter(Boolean)),
  ) as string[];

  return (
    <ReusableTable
      data={products}
      columns={columns}
      defaultPageSize={10}
      tabComponent={(table) => (
        <Tab
          table={table}
          filters={[
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
  );
};

export default InventoryTable;
