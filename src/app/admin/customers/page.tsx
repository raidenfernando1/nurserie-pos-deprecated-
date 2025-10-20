"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReusableTable from "@/components/product-container";
import Tab from "@/components/table/table-tab";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePopupStore } from "@/store/popup-store";

const Customers = () => {
  const { openPopup } = usePopupStore();

  const [customers, setCustomers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (error) return <div>Error: {error}</div>;

  const columns: ColumnDef<any>[] = [
    {
      id: "ID",
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "Customer Info",
      accessorFn: (row) => {
        // Combine all searchable fields into one string
        const parts = [row.name, row.phone_number, row.email].filter(Boolean); // Remove null/undefined values

        const result = parts.join(" ");
        console.log("AccessorFn result:", result); // DEBUG: See what's being indexed
        return result;
      },
      cell: ({ row }) => {
        const { name, phone_number, email } = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-muted-foreground">
              {phone_number}
            </span>
            {email && (
              <span className="text-sm text-muted-foreground">{email}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "Loyalty Card Number",
      accessorKey: "loyalty_number",
      header: "Loyalty Card Number",
    },
    {
      id: "Added By",
      header: "Added by",
      cell: ({ row }) => {
        const addedBy = row.original.created_by_name ?? "—";
        const createdAt = row.original.created_at
          ? new Date(row.original.created_at)
          : null;
        const role = row.original.created_by_role ?? "";

        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {addedBy}
              {role && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({role})
                </span>
              )}
            </span>
            {createdAt && (
              <span className="text-sm text-muted-foreground">
                {createdAt.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;

        const handleCopy = (text: string) => {
          navigator.clipboard.writeText(text);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleCopy(
                    `Name: ${customer.name}\nPhone: ${
                      customer.phone_number ?? "N/A"
                    }\nEmail: ${customer.email ?? "N/A"}`
                  )
                }
              >
                Copy Customer Contacts
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleCopy(customer.id.toString())}
              >
                Copy Customer ID
              </DropdownMenuItem>

              {customer.loyalty_number && (
                <DropdownMenuItem
                  onClick={() => handleCopy(customer.loyalty_number)}
                >
                  Copy Loyalty Card
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
    fetchCustomers();
  }, []);

  return (
    <ReusableTable
      data={customers}
      columns={columns}
      tabComponent={(table) => <Tab table={table} />}
    />
  );
};

export default Customers;
