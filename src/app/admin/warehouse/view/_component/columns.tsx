import { ColumnDef } from "@tanstack/react-table";
import { Warehouse } from "@/types/warehouse";

export const TableColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "warehouse_name",
    header: "Warehouse Name",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    filterFn: "includesString", // makes it searchable
  },
  {
    accessorKey: "company_id",
    header: "Company ID",
    cell: ({ getValue }) => <span>{getValue<number>()}</span>,
  },
  {
    accessorKey: "total_stock",
    header: "Total Stock",
    cell: ({ getValue }) => <span>{getValue<number>().toLocaleString()}</span>,
  },
  {
    accessorKey: "total_products",
    header: "Total Products",
    cell: ({ getValue }) => <span>{getValue<number>().toLocaleString()}</span>,
  },
];
