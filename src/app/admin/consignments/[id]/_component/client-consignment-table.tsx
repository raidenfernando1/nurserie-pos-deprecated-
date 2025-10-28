"use client";

import ReusableTable from "@/components/table/reusable-table";
import Tab from "@/components/table/table-tab";

export default function ClientConsignmentTable({
  products,
}: {
  products: any;
}) {
  const columns = [
    {
      accessorKey: "consignment_id",
      header: "Consignment ID",
    },
    {
      accessorKey: "client_id",
      header: "Client ID",
    },
    {
      accessorKey: "consignment_name",
      header: "Consignment Name",
    },
    {
      accessorKey: "warehouse_id",
      header: "Warehouse ID",
    },
    {
      accessorKey: "date_sent",
      header: "Date Sent",
      cell: ({ row }: any) =>
        row.original.date_sent
          ? new Date(row.original.date_sent).toLocaleString()
          : "—",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "date_not_active",
      header: "Date Not Active",
      cell: ({ row }: any) =>
        row.original.date_not_active
          ? new Date(row.original.date_not_active).toLocaleString()
          : "—",
    },
  ];

  return (
    <ReusableTable
      data={products}
      columns={columns as any}
      tabComponent={(table) => <Tab table={table} />}
    />
  );
}
