"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { usePopupStore } from "@/store/popup-store";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCustomerAction } from "../actions/create-costumer";

const CreateCustomerPopup = () => {
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { closePopup } = usePopupStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("name", name);
    formData.set("phone_number", phone_number);
    formData.set("email", email);

    startTransition(async () => {
      try {
        const res = await createCustomerAction(formData);
        setSuccess(true);
        setName("");
        setPhoneNumber("");
        setEmail("");

        setTimeout(() => {
          closePopup();
        }, 2000);
      } catch (err: any) {
        console.error(">>> Server Action Error:", err);
        setError(err.message || "Failed to create customer");
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Create New Customer
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Add a new customer profile to the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="animate-in fade-in-50 border-green-500/50 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="ml-2 text-green-500">
                Customer created successfully!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="Enter Phone number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isPending}
                onClick={() => closePopup()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isPending}
              >
                <UserPlus className="h-4 w-4" />
                {isPending ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerPopup;
