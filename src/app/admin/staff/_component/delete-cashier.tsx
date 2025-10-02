"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteCashierProps {
  cashier: {
    id: string;
  };
  onDeleteCashier?: () => void;
}

export const DeleteCashier = ({
  cashier,
  onDeleteCashier,
}: DeleteCashierProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient(); // ✅ React Query client

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/cashier/${cashier.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Cashier deleted successfully!");

        await queryClient.invalidateQueries({ queryKey: ["cashiers"] });

        if (onDeleteCashier) {
          onDeleteCashier();
        }
      } else {
        toast.error(data.error || "Failed to delete cashier");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Cashier"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this cashier? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
