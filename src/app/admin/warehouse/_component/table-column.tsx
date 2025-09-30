import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product";
import StatusBadge from "./StatusBadge";

export const totalStockColumns: ColumnDef<Product>[] = [
  {
    id: "name_price",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.image_url}
          alt=""
          className="w-10 h-10 object-cover rounded"
        />
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-gray-500">₱{row.original.price}</span>
        </div>
      </div>
    ),
  },

  {
    id: "brand_category",
    header: "Brand / Category",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{row.original.brand}</span>
        <span className="text-gray-500 text-sm">{row.original.category}</span>
      </div>
    ),
    accessorFn: (row) => `${row.brand} ${row.category}`,
    filterFn: "includesString",
  },

  {
    id: "sku_barcode",
    header: "SKU / Barcode",
    accessorFn: (row) => `${row.sku} ${row.barcode}`,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.sku}</span>
        <span className="text-gray-500 text-sm">{row.original.barcode}</span>
      </div>
    ),
    filterFn: "includesString",
  },

  {
    id: "stock_info",
    header: "Stock / Threshold",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>Stock: {row.original.stock}</span>
          <StatusBadge
            stock={row.original.stock}
            threshold={row.original.stock_threshold}
          />
        </div>
        <div className="text-gray-500 text-sm">
          Threshold: {row.original.stock_threshold}
        </div>
      </div>
    ),
    accessorFn: (row) => `${row.stock} ${row.stock_threshold}`,
    filterFn: "includesString",
  },

  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.warehouse_name}</span>
    ),
    filterFn: "includesString",
  } as ColumnDef<Product>,
];
