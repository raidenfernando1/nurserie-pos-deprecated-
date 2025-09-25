"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ImageOff, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Product = {
  product_id: number;
  product_name: string;
  product_variants_id?: number;
  variant_name?: string;
  total_stock_in_warehouse?: number;
  brand?: string;
  description?: string;
  barcode?: number;
  stock_threshold?: number;
  img_url?: string | null;
  variant_sku?: string;
  variant_price?: number;
};

function ProductImage({ src, alt }: { src?: string | null; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <ImageOff size={32} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: 32,
        height: 32,
        objectFit: "cover",
        borderRadius: 4,
      }}
      onError={() => setError(true)}
    />
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { img_url, product_name } = row.original;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ProductImage src={img_url} alt={product_name} />
          <span>{product_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "variant_sku",
    header: "Product SKU",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "variant_price",
    header: "Price",
    cell: ({ getValue }) => `₱${getValue()}`,
  },
  {
    id: "options",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(product.barcode))
              }
            >
              Copy Product Barcode
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Product details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
