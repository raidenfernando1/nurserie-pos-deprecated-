"use client";

import { useState } from "react";
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

interface UserManagementProps {
  cashier: {
    id: string;
    name?: string;
    username?: string;
    banned?: boolean; // keeping this for now, but treated as inactive flag
  };
  onStatusChange?: () => void;
}
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function UserManagement({
  cashier,
  onStatusChange,
}: UserManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleBanUser = async (userId: string) => {
    try {
      // Call Better Auth's admin API to ban the user
      const { data, error } = await authClient.admin.banUser({ userId });

      if (error) {
        console.error("Better Auth ban error:", error);
        toast.error("Failed to deactivate this user");
        return;
      }

      // ✅ Success
      toast.success("User deactivated successfully");
      await queryClient.invalidateQueries({ queryKey: ["cashiers"] });

      setIsOpen(false);
      onStatusChange?.();
    } catch (error) {
      console.error("Deactivate error:", error);
      toast.error("An unexpected error occurred while deactivating the user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      // Call Better Auth's admin API to ban the user
      const { data, error } = await authClient.admin.unbanUser({ userId });

      if (error) {
        console.error("Better Auth ban error:", error);
        toast.error("Failed to deactivate this user");
        return;
      }

      // ✅ Success
      toast.success("User activated successfully");
      await queryClient.invalidateQueries({ queryKey: ["cashiers"] });

      setIsOpen(false);
      onStatusChange?.();
    } catch (error) {
      console.error("activate error:", error);
      toast.error("An unexpected error occurred while activating the user");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={cashier.banned ? "success" : "destructive"}>
          {cashier.banned ? "Activate" : "Deactivate"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {cashier.banned ? "Activate User" : "Deactivate User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {cashier.banned
              ? `Are you sure you want to activate ${
                  cashier.name || cashier.username
                }? They will be able to sign in again.`
              : `Are you sure you want to deactivate ${
                  cashier.name || cashier.username
                }? They will no longer be able to sign in.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={cashier.banned ? "success" : "destructive"}
              onClick={() =>
                cashier.banned
                  ? handleUnbanUser(cashier.id)
                  : handleBanUser(cashier.id)
              }
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
