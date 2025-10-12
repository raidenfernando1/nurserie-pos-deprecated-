"use client";
import { useEffect } from "react";
import ReusableTable from "@/components/reusable-table";
import useProductsPopups from "./_store/products-popups";
import { useProductStore } from "@/store/product-store";
import Header from "./_components/product-header";
import PopupHandler from "./_components/popup-handler";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import Tab from "../../../components/table-tab";

const Products = () => {
  const { fetchAllProducts, products } = useProductStore();
  const { togglePopup } = useProductsPopups();

  const Columns = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3 hover:opacity-80">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <img
              src={row.original.image_url}
              className="object-cover rounded w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <div className="flex">
              <span className="text-sm text-gray-500">
                {row.original.brand}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category" },
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
    {
      accessorKey: "rowCTA",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={() => togglePopup("delete", row.original)}
          >
            <Trash />
          </Button>
          <Button
            variant="outline"
            onClick={() => togglePopup("edit", row.original)}
          >
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
        <Header />
        <div className="flex-1 min-h-0">
          <ReusableTable
            data={products}
            columns={Columns}
            tabComponent={(table) => (
              <Tab table={table} categories={categories} />
            )}
          />
        </div>
      </div>
    </PopupHandler>
  );
};

export default Products;
