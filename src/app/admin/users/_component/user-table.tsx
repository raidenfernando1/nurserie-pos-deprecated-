"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Tab from "@/components/table/table-tab";
import ReusableTable from "@/components/table/reusable-table";
import { Button } from "@/components/ui/button";
import { UserPen, User } from "lucide-react";
import { usePopupStore } from "@/store/popup-store";
import { banUser, unbanUser } from "../_action/userManagement";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  banned?: boolean; // Add this to track ban status
}

const UserTable = ({ users }: { users: User[] }) => {
  const { openPopup } = usePopupStore();
  const queryClient = useQueryClient();

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
      accessorKey: "createdAt",
      header: "Date Added",
      cell: ({ getValue }) => {
        const date = new Date(getValue<string>());
        return date.toISOString().split("T")[0];
      },
    },
    {
      accessorKey: "rowCTA",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-3 justify-end">
          {!row.original.banned ? (
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await banUser(row.original.id);
                  toast.success("User deactivated successfully");
                  await queryClient.invalidateQueries({
                    queryKey: ["cashiers"],
                  });
                } catch (error: any) {
                  toast.error(error.message || "Failed to deactivate user");
                }
              }}
            >
              <User />
              Deactivate
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={async () => {
                try {
                  await unbanUser(row.original.id);
                  toast.success("User activated successfully");
                  await queryClient.invalidateQueries({
                    queryKey: ["cashiers"],
                  });
                } catch (error: any) {
                  toast.error(error.message || "Failed to activate user");
                }
              }}
            >
              <User />
              Activate
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              openPopup("change-user-password", {
                cashier: row.original,
              })
            }
          >
            <UserPen />
            Change Password
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ReusableTable
      data={users}
      columns={columns}
      tabComponent={(table) => (
        <Tab
          table={table}
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => openPopup("admin-create-cashier")}
              >
                <User />
                Create Cashier
              </Button>
            </>
          }
        />
      )}
    />
  );
};

export default UserTable;
