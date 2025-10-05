import Link from "next/link";

export const Columns = [
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
