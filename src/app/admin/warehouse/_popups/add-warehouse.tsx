"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Warehouse, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddWarehouseProps {
  onClose: () => void;
}

const AddWarehouse = ({ onClose }: AddWarehouseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");

  const resetForm = () => {
    setWarehouseName("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!warehouseName.trim()) {
        throw new Error("Please enter a warehouse name");
      }

      const response = await fetch("/api/admin/warehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouse_name: warehouseName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create warehouse");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("❌ Error creating warehouse:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        {!showSuccess ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-semibold">
                  New Warehouse
                </DialogTitle>
                <Badge variant="secondary">Create Warehouse</Badge>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="warehouseName">Warehouse Name *</Label>
                <Input
                  id="warehouseName"
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  placeholder="Enter warehouse name"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Warehouse...
                    </>
                  ) : (
                    "Create Warehouse"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl font-semibold">
                Warehouse Created!
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center space-y-4 py-6">
              <Warehouse className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">
                Warehouse Added Successfully!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your warehouse has been created.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowSuccess(false);
                }}
                className="flex-1"
              >
                Add Another
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouse;
