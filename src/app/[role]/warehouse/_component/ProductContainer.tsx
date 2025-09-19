"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import dummydata from "./dummydata.json";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Filters from "./Filters";

interface Product {
  product_id: number;
  product_name: string;
  variant_id?: number;
  variant_name?: string;
  total_stock?: number | string; // API might send as string
  stock_threshold?: number | string;
  variant_price?: number;
  variant_sku?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  brand?: string;
  description?: string;
  barcode?: number | string;
  img_url?: string;
}

// Fix the columns to match your actual data structure
export const totalStockColumns: ColumnDef<Product>[] = [
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
    header: "Product Name",
  },
  {
    accessorKey: "variant_name",
    header: "Variant",
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
    cell: ({ getValue }) => `$${getValue()}`,
  },
  {
    accessorKey: "total_stock",
    header: "Stock",
  },
  {
    accessorKey: "stock_threshold",
    header: "Stock Threshold",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const stock = Number(row.original.total_stock ?? 0);
      const threshold = Number(row.original.stock_threshold ?? 0);

      if (stock === 0) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Out of Stock
          </span>
        );
      } else if (stock <= threshold) {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Low Stock
          </span>
        );
      } else {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            In Stock
          </span>
        );
      }
    },
  },
];

const ProductTable: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/warehouse/products");
        const json: Product[] = await res.json();
        const normalized = json.map((item: any) => ({
          ...item,
          total_stock: Number(item.total_stock),
          stock_threshold: Number(item.stock_threshold),
          variant_price: Number(item.variant_price),
        }));
        setData(normalized);
        setLoading(false);
        console.log(normalized);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const table = useReactTable({
    data: data,
    columns: totalStockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={totalStockColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
