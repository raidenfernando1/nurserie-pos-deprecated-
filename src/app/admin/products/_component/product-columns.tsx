import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const Columns = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }: any) => (
      <Link
        href={`/products/${row.original.id}`}
        className="flex items-center gap-3 hover:opacity-80"
      >
        <div className="w-16 h-16 relative flex-shrink-0">
          <img
            src={row.original.image_url}
            className="object-cover rounded w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <div className="flex">
            <span className="text-sm text-gray-500">
              {row.original.brand} · {row.original.category}
            </span>
          </div>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "price",
    header: "SRP",
    cell: ({ row }: any) =>
      `₱${parseFloat(row.original.price).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
  {
    accessorKey: "barcode",
    header: "Barcode / SKU",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className="font-medium">{row.original.barcode}</span>
          <div className="flex">
            <span className="text-sm text-gray-500">{row.original.sku}</span>
          </div>
        </div>
      </div>
    ),
  },
];
