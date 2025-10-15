"use client";

import { useEffect, useState } from "react";
import ReusableTable from "@/components/table/reusable-table";
import Tab from "../../../../components/table/table-tab";
import React from "react";
import StatusBadge from "@/components/table/status-badge";
import LoadingBar from "@/components/loading-page";
import PopupHandler from "./_components/popup-handler";
import { Button } from "@/components/ui/button";
import { usePopupStore } from "@/store/popup-store";
import { Plus } from "lucide-react";

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
            <span className="font-semibold ">{row.original.name}</span>
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
        <span className="font-medium ">
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
          <span className="font-mono text-sm font-medium">
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

export default function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [warehouseData, setWarehouseData] = useState<{
    warehouse_id: number;
    warehouse_name: string;
  } | null>(null);
  const { id } = React.use(params);
  const { openPopup } = usePopupStore();

  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        const response = await fetch(`/api/admin/warehouse/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();

        setWarehouseData({
          warehouse_id: data.warehouse.id,
          warehouse_name: data.warehouse.warehouse_name,
        });

        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
      }
    };

    if (id) {
      fetchWarehouseData();
    }
  }, [id]);

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  return (
    <LoadingBar>
      <PopupHandler warehouseID={id}>
        <div className="h-screen p-3 flex flex-col gap-3">
          <h1>{warehouseData?.warehouse_name || "Warehouse"}</h1>
          <div className="flex-1 min-h-0">
            <ReusableTable
              data={products}
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
          </div>
        </div>
      </PopupHandler>
    </LoadingBar>
  );
}
