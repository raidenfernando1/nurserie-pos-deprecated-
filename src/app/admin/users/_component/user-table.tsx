"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Tab from "@/components/table/table-tab";
import ReusableTable from "@/components/table/reusable-table";
import { Button } from "@/components/ui/button";
import { X, UserPen } from "lucide-react";
import { usePopupStore } from "@/store/popup-store";

export interface User {
  id: string;
  name: string;
  username: string;
  dateAdded: string;
}

const UserTable = ({ users }: { users: User[] }) => {
  const { openPopup } = usePopupStore();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "userData",
      header: "User Information",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.name}</span>
          <span className="text-xs text-gray-400 tracking-tight">
            ( {row.original.id} )
          </span>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "dateAdded",
      header: "Date Added",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
    },
    {
      accessorKey: "rowCTA",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() =>
              openPopup("change-user-password", {
                cashier: row.original,
              })
            }
          >
            <UserPen />
          </Button>
          <Button variant="destructive">
            <X />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ReusableTable
      data={users}
      columns={columns}
      tabComponent={(table) => <Tab table={table} />}
    />
  );
};

export default UserTable;
