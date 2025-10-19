"use client";

import ReusableTable from "@/components/table/reusable-table";
import Tab from "@/components/table/table-tab";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePopupStore } from "@/store/popup-store";

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
  { accessorKey: "warehouse_name", header: "Warehouse" },
  { accessorKey: "total_products", header: "Total products" },
  { accessorKey: "total_stock", header: "Total stock" },
  { accessorKey: "products_in_stock", header: "In Stock" },
  { accessorKey: "low_stock_products", header: "Low Stock" },
  { accessorKey: "out_of_stock_products", header: "Out of Stock" },
];

const WarehouseTable = ({ warehouses }: { warehouses: Warehouse[] }) => {
  const { openPopup } = usePopupStore();

  return (
    <ReusableTable
      data={warehouses}
      columns={columns}
      tabComponent={(table) => (
        <Tab
          table={table}
          actions={
            <Button
              variant="outline"
              onClick={() => openPopup("add-warehouse")}
            >
              <Plus />
            </Button>
          }
        />
      )}
    />
  );
};

export default WarehouseTable;
