"use client";

import ReusableTable from "@/components/table/reusable-table";
import Tab from "@/components/table/table-tab";

export default function ClientsTable({ clients }: { clients: any }) {
  const columns = [
    {
      accessorKey: "client_name",
      header: "Name",
    },
    {
      accessorKey: "serial_key",
      header: "identifier",
    },
    {
      accessorKey: "code_name",
      header: "Code",
    },
    {
      accessorKey: "date_added",
      header: "Date Added",
      cell: ({ row }: any) =>
        new Date(row.original.date_added).toLocaleDateString(),
    },
  ];

  return (
    <ReusableTable
      data={clients}
      columns={columns as any}
      tabComponent={(table) => <Tab table={table} />}
    />
  );
}
