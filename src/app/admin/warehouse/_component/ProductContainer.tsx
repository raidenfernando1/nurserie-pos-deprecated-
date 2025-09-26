"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { totalStockColumns } from "./TableColumns";
import Tab from "./TableTab";
import useWarehouseStore from "@/store/useWarehouse";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProductTable: React.FC = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const { data, isLoading, isError } = useProducts();
  const { setStockCount } = useWarehouseStore();

  const table = useReactTable({
    data: data ?? [],
    columns: totalStockColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { pagination, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  const total = useMemo(() => {
    return data?.length ?? 0;
  }, [data]);

  useEffect(() => {
    setStockCount(total);
  }, [total, setStockCount]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error Fetching Products :|</div>;

  return (
    <div className="flex flex-col gap-6">
      <Tab
        table={table}
        currentPage={table.getState().pagination.pageIndex + 1}
        lastPage={table.getPageCount()}
        categories={Array.from(new Set((data ?? []).map((d) => d.category)))}
      />

      <div className="w-full flex h-full ">
        <div className="flex w-full ">
          <Table className="border-none">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={totalStockColumns.length}
                    className="text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
