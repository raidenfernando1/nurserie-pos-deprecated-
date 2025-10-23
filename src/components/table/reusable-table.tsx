"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReusableTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  defaultPageSize?: number;
  minRows?: number;
  tabComponent?: (table: any) => React.ReactNode;
}

const ReusableTable = <T,>({
  data,
  columns,
  defaultPageSize = 10,
  minRows = 10,
  tabComponent,
}: ReusableTableProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState<any>([]);

  // Memoize data to prevent unnecessary rerenders
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

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

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [memoizedData]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { pagination, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase().trim();

      const searchWords = search.split(/\s+/).filter((word) => word.length > 0);
      if (searchWords.length === 0) return true;

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

      return searchWords.every((word) => rowText.includes(word));
    },
  });

  const pageIndex = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();

  return (
    <div className="h-full flex flex-col gap-3">
      {tabComponent && (
        <div className="flex-shrink-0">{tabComponent(table)}</div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full border rounded-lg overflow-hidden bg-card">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-base font-medium">
                          No results found
                        </p>
                        <p className="text-sm mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center px-3 min-w-[100px]">
            <span className="text-sm font-medium">
              Page {pageIndex} of {pageCount || 1}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
