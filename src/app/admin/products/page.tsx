"use client";
import { useEffect } from "react";
import ReusableTable from "@/components/table/reusable-table";
import PopupHandler from "@/components/popup/popup-handler";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus } from "lucide-react";
import Tab from "../../../components/table/table-tab";
import { useProductStore } from "@/store/product-store";
import { usePopupStore } from "@/store/popup-store";

const Products = () => {
  const { fetchAllProducts, products } = useProductStore();
  const { togglePopup } = usePopupStore();

  const Columns = [
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
            variant="destructive"
            onClick={() => togglePopup("delete-product")}
          >
            <Trash />
          </Button>
          <Button variant="outline" onClick={() => togglePopup("edit-product")}>
            <Edit />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const categories = Array.from(new Set(products.map((d) => d.category)));

  return (
    <PopupHandler>
      <div className="h-screen p-3 flex flex-col gap-3">
        <h1>Products</h1>
        <div className="flex-1 min-h-0">
          <ReusableTable
            data={products}
            columns={Columns}
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
                      onClick={() => togglePopup("add-product")}
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
  );
};

export default Products;
