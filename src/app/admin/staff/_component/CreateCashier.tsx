import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CreateCashier() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log(">>> Submitting cashier creation:", {
      username,
      password: "****",
    });

    try {
      const response = await fetch("/api/admin/cashier", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log(">>> Raw response:", response);

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error(">>> Failed to parse JSON response:", jsonErr);
      }

      console.log(">>> Parsed response JSON:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Unknown error from server");
      }

      setSuccess(true);
      setUsername("");
      setPassword("");

      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error(">>> Error in handleSubmit:", err);
      setError(err.message || "Failed to create cashier");
    } finally {
      setLoading(false);
      console.log(">>> Finished cashier creation attempt");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setUsername("");
      setPassword("");
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Cashier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Cashier</DialogTitle>
          <DialogDescription>
            You are about to create a new cashier profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm">
              Cashier created successfully!
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Cashier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
