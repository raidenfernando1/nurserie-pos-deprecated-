"use client";

import React, { useState, useEffect, useMemo } from "react";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Filters from "./Filters";

interface Product {
  warehouse_id: number;
  warehouse_name: string;
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_name: string;
  total_stock: number;
  stock_threshold: number;
  variant_price: number;
  variant_sku: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("product_name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("variant_name", { header: "Variant" }),
  columnHelper.accessor("total_stock", { header: "Stock" }),
  columnHelper.accessor("stock_threshold", { header: "Threshold" }), // <-- new column
  columnHelper.accessor("variant_sku", { header: "SKU" }),
  columnHelper.accessor("variant_price", {
    header: "Price",
    cell: (info) => `₱${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const value = info.getValue();
      const color =
        value === "in-stock"
          ? "bg-green-700"
          : value === "low-stock"
          ? "bg-yellow-500"
          : "bg-red-500";
      return (
        <span className={`px-2 py-1 rounded text-white ${color}`}>
          {value.replace("-", " ")}
        </span>
      );
    },
  }),
];

const ProductTable: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [variantFilter, setVariantFilter] = useState("");

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/warehouse/products");
        if (!res.ok) {
          console.error("Failed to fetch products:", res.status);
          setLoading(false);
          return;
        }
        const productsFromApi: Product[] = await res.json();

        // Add status based on stock
        // Add status based on stock vs threshold
        const productsWithStatus = productsFromApi.map((p) => ({
          ...p,
          status:
            p.total_stock === 0
              ? "out-of-stock"
              : p.total_stock < p.stock_threshold
              ? "low-stock"
              : "in-stock", // TypeScript sees this as string
        })) as Product[]; // <-- cast to Product[]

        setData(productsWithStatus);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const totalStock = data.reduce((sum, p) => sum + p.total_stock, 0);
  const lowStock = data
    .filter((p) => p.status === "low-stock")
    .reduce((sum, p) => sum + p.total_stock, 0);
  const outOfStock = data
    .filter((p) => p.status === "out-of-stock")
    .reduce((sum, p) => sum + p.total_stock, 0);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.product_name
        .toLowerCase()
        .includes(globalFilter.toLowerCase());
      const matchesVariant = variantFilter
        ? item.variant_name === variantFilter
        : true;
      return matchesSearch && matchesVariant;
    });
  }, [data, globalFilter, variantFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  });

  const variants = Array.from(new Set(data.map((d) => d.variant_name)));

  if (loading) return <p>Loading products...</p>;
  if (!data.length) return <p>No products found.</p>;

  return (
    <div className="w-full space-y-4">
      <Filters
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        categoryFilter={variantFilter}
        setCategoryFilter={setVariantFilter}
        categories={variants}
      />
      <div className="w-full px-4">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
