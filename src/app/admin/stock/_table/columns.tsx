import StatusBadge from "@/components/table/status-badge";

export const columns = [
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
