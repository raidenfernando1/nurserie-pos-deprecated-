"use client";
import ReusableTable from "@/components/table/reusable-table";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Hand, Package, Plus, Warehouse } from "lucide-react";
import Tab from "@/components/table/table-tab";
import { usePopupStore } from "@/store/popup-store";
import StatusBadge from "@/components/table/status-badge";

interface WarehouseProduct {
  warehouse_product_id: string;
  product_id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  price: number;
  image_url: string;
  stock: number;
  stock_threshold: number;
}

export default function WarehouseTable({
  products,
}: {
  products: WarehouseProduct[];
}) {
  const { openPopup } = usePopupStore();

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
              <span className="font-semibold">{row.original.name}</span>
              <StatusBadge
                stock={row.original.stock}
                threshold={row.original.stock_threshold}
              />
            </div>
          </div>
        </div>
      ),
      accessorFn: (row: any) => row.name,
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
            <span className="text-xs">SKU:</span>
            <span className="text-sm font-medium">{row.original.sku}</span>
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
      cell: ({ row }: any) => (
        <span className="font">
          {row.original.price
            ? `₱${row.original.price.toLocaleString()}`
            : "N/A"}
        </span>
      ),
    },

    {
      id: "stock_info",
      header: "Stock Status",
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>Current:</span>
            <span>{row.original.stock}</span>
          </div>
          <div className="flex items-center">
            <span>Threshold:</span>
            <span>{row.original.stock_threshold}</span>
          </div>
        </div>
      ),
      accessorFn: (row: any) => `${row.stock} ${row.stock_threshold}`,
      filterFn: "includesString" as const,
    },

    {
      accessorKey: "rowCTA",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              openPopup("transfer-product-to-store", {
                product: row.original,
                storeID: 1,
              })
            }
          >
            <ArrowBigLeft />
            <Hand />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              openPopup("move-product-warehouse", { product: row.original })
            }
          >
            <ArrowBigLeft />
            <Warehouse />
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              openPopup("add-warehouse-product-stock", {
                product: row.original,
              });
            }}
          >
            <Plus />
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              openPopup("confirm-delete-warehouse-product", {
                product: row.original,
              });
            }}
          >
            <Package />
          </Button>
        </div>
      ),
    },
  ];

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );

  return (
    <ReusableTable
      data={products}
      columns={columns}
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
          ]}
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => openPopup("add-product-warehouse")}
              >
                <Plus />
              </Button>
            </>
          }
        />
      )}
    />
  );
}
