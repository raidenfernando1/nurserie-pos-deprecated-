"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQuery } from "@tanstack/react-query";
import { ChangePassword } from "./ChangePassword";
import { Delete } from "lucide-react";
import { DeleteCashier } from "./DeleteCashier";

const fetchCashiers = async () => {
  const res = await fetch("/api/admin/cashier");
  if (!res.ok) throw new Error("Failed to fetch cashiers");
  return res.json();
};

const CashierTable = () => {
  const {
    data: cashiers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cashiers"],
    queryFn: fetchCashiers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <Table>
        <TableCaption>A list of your cashiers</TableCaption>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashiers.map((cashier: any) => (
            <TableRow key={cashier.id}>
              <TableCell className="max-w-15 truncate">{cashier.id}</TableCell>
              <TableCell>{cashier.name}</TableCell>
              <TableCell>{cashier.name}</TableCell>
              <TableCell>
                {new Date(cashier.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <ChangePassword cashier={cashier} />
              </TableCell>
              <TableCell>
                <DeleteCashier cashier={cashier} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CashierTable;
