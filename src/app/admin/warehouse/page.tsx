"use client";

import LoadingBar from "@/components/loading-page";
import ReusableTable from "@/components/table/reusable-table";
import Tab from "@/components/table/table-tab";

import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { fetcher } from "@/utils/swrFetcher";
import { Loader2, Plus } from "lucide-react";
import PopupHandler from "./_components/popup-handler";
import { usePopup } from "./_store/usePopup";
import { Button } from "@/components/ui/button";

type Warehouse = {
  warehouse_id: number;
  warehouse_name: string;
  total_products: string;
  total_stock: string;
  products_in_stock: string;
  low_stock_products: string;
  out_of_stock_products: string;
};

const columns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }) => <span>{row.getValue("warehouse_name")}</span>,
  },

  {
    accessorKey: "total_products",
    header: "Total products",
  },

  {
    accessorKey: "total_stock",
    header: "Total stock",
  },

  {
    accessorKey: "products_in_stock",
    header: "In Stock",
  },

  {
    accessorKey: "low_stock_products",
    header: "Low Stock",
  },

  {
    accessorKey: "out_of_stock_products",
    header: "Out of Stock",
  },
];

const Warehouse = () => {
  const { data, error, isLoading } = useSWR<{
    success: boolean;
    response: Warehouse[];
  }>("/api/admin/warehouse?full=true", fetcher);
  const { togglePopup } = usePopup();

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive font-medium">
          Failed to load warehouses. Please try again later.
        </p>
      </div>
    );

  const warehouses = data?.response || [];

  return (
    <LoadingBar>
      <PopupHandler>
        <div className="h-screen p-3 flex flex-col gap-3">
          <h1>Warehouse Overview</h1>
          <div className="flex-1 min-h-0">
            <ReusableTable
              data={warehouses}
              columns={columns}
              tabComponent={(table) => (
                <Tab
                  table={table}
                  actions={
                    <>
                      <Button
                        variant="outline"
                        onClick={() => togglePopup("make-warehouse")}
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
};

export default Warehouse;
