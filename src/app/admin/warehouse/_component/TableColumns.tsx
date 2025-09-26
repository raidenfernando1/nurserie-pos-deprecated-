import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product";
import StatusBadge from "./StatusBadge";

export const totalStockColumns: ColumnDef<Product>[] = [
  {
    id: "name_price",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10">
            <img
              src={row.original.img_url}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-gray-500">₱{row.original.price}</span>
          </div>
        </div>
      </div>
    ),
    accessorFn: (row) => `${row.name} ${row.price}`,
    filterFn: "includesString",
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
    accessorFn: (row) => `${row.sku} ${row.barcode}`, // used for filtering/sorting
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
];
