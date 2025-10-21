"use client";

import ReusableTable from "@/components/table/reusable-table";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus, View } from "lucide-react";
import Tab from "@/components/table/table-tab";
import { usePopupStore } from "@/store/popup-store";

import type { Product } from "@/types/product";

export default function ProductsTable({ products }: { products: Product[] }) {
  const { openPopup } = usePopupStore();

  const columns = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3 hover:opacity-80">
          <div className="w-10 h-10 cbg-gray-100 rounded flex items-center justify-center">
            <img
              src={row.original.image_url}
              className="object-cover rounded w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <div className="flex">
              <span className="text-sm">{row.original.brand}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
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
              <span className="text-sm">{row.original.sku}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "rowCTA",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              openPopup("product-data-view", { product: row.original })
            }
          >
            <View />
          </Button>

          <Button
            variant="outline"
            onClick={() => openPopup("edit-product", { product: row.original })}
          >
            <Edit />
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              openPopup("delete-product", { product: row.original })
            }
          >
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  const categories = Array.from(new Set(products.map((d) => d.category)));

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
                onClick={() => openPopup("add-product")}
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
