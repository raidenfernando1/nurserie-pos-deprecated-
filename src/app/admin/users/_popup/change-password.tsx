import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { changePassword } from "../_action/changePassword";
import { usePopupStore } from "@/store/popup-store";

interface ChangePasswordPopupProps {
  data?: Record<string, any>;
}

export default function ChangePasswordPopup({
  data,
}: ChangePasswordPopupProps) {
  const { closePopup } = usePopupStore();
  const [newPassword, setNewPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const cashier = data?.cashier;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (!cashier?.id) {
      toast.error("Invalid cashier data");
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(cashier.id, newPassword);

      if (result.data) {
        toast.success("Password changed successfully!");
        setNewPassword("");
        closePopup();
        data?.onPasswordChanged?.();
      }
    } catch (error) {
      console.error("Error calling changePassword:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while changing password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleChangePassword}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Change the password for this cashier account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Cashier ID</Label>
              <p className="text-sm text-gray-600">{cashier?.id}</p>
            </div>
            <div className="grid gap-3">
              <Label>Full Name</Label>
              <p className="text-sm text-gray-600">{cashier?.name}</p>
            </div>
            <div className="grid gap-3">
              <Label>Username</Label>
              <p className="text-sm text-gray-600">{cashier?.username}</p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-input">New Password</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => closePopup()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
