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
    accessorKey: "product_name",
    header: "Name",
    filterFn: "includesString",
  },

  {
    accessorKey: "variant_name",
    header: "Variant",
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: "includesString",
  },
  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
  },
  {
    accessorKey: "variant_sku",
    header: "SKU",
  },
  {
    accessorKey: "variant_price",
    header: "Price",
    cell: ({ getValue }) => `₱${getValue()}`,
  },
];
