"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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

interface ReusableTableProps<T> {
  data: T[];
  columns: any;
  defaultPageSize?: number;
  minRows?: number;
  tabComponent?: (table: any, showActions?: boolean) => React.ReactNode;
  showActions?: boolean;
}

const ReusableTable = <T,>({
  data,
  columns,
  defaultPageSize = 10,
  minRows = 5,
  tabComponent,
  showActions = true,
}: ReusableTableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState<any>([]);

  const calculatePageSize = () => {
    const viewportHeight = window.innerHeight;
    const tabHeight = tabComponent ? 80 : 0;
    const headerHeight = 60;
    const layoutPadding = 120;
    const rowHeight = 60;
    const availableHeight =
      viewportHeight - tabHeight - headerHeight - layoutPadding;
    return Math.max(Math.floor(availableHeight / rowHeight), minRows);
  };

  useEffect(() => {
    const updatePageSize = () => {
      setPagination((prev) => ({ ...prev, pageSize: calculatePageSize() }));
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { pagination, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase().trim();

      // Split search into individual words
      const searchWords = search.split(/\s+/).filter((word) => word.length > 0);

      // If no search words, show all
      if (searchWords.length === 0) return true;

      // Collect all searchable text from the row
      const rowText = columns
        .map((col: any) => {
          let value;

          if (col.accessorFn) {
            value = col.accessorFn(row.original);
          } else if (col.accessorKey) {
            value = row.original[col.accessorKey as keyof typeof row.original];
          }

          return String(value || "").toLowerCase();
        })
        .join(" ");

      // Check if ALL search words are present in the row text (order doesn't matter)
      return searchWords.every((word) => rowText.includes(word));
    },
  });

  return (
    <div className="h-full flex flex-col gap-6">
      {tabComponent && (
        <div className="flex-shrink-0">{tabComponent(table, showActions)}</div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full border rounded-lg overflow-auto">
          <Table className="border-none">
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows per page:
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 w-[70px] border border-input bg-background px-3 py-1 text-xs rounded-md"
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 border rounded-md disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 border rounded-md disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 border rounded-md disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 border rounded-md disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
