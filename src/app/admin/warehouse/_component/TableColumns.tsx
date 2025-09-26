import { ColumnDef } from "@tanstack/react-table";
import type { ProductType } from "@/app/types/products";
import StatusBadge from "./StatusBadge";

export const totalStockColumns: ColumnDef<ProductType>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-10 h-10">
        <img
          src={row.original.img_url}
          className="w-full h-full object-cover rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
  },

  {
    accessorKey: "brand",
    header: "brand",
  },
  {
    accessorKey: "sku",
    header: "sku",
  },
  {
    accessorKey: "barcode",
    header: "barcode",
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: "includesString",
  },
  {
    accessorKey: "stock",
    header: "stock",
  },
  {
    accessorKey: "stock_threshold",
    header: "threshold",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => `₱${getValue()}`,
  },
];
