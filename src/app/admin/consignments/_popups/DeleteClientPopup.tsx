"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useClient from "../../_store/useClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2 } from "lucide-react";

interface DeleteClientProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  refetch?: () => void;
}

const DeleteClient = ({ open, onOpenChange }: DeleteClientProps) => {
  const [serialKey, setSerialKey] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [stage, setStage] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(false);

  const { deleteClient, findClient } = useClient();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const client = await findClient(serialKey);

      if (client) {
        setProduct(client);
        setStage(1);
      } else {
        alert("No consignment found with that UUID.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch consignment.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async ({
    onClose,
    refetch,
  }: {
    onClose?: () => void;
    refetch?: () => void;
  } = {}) => {
    try {
      const data = await deleteClient(serialKey);

      refetch?.();
      onClose?.();
      onOpenChange(false);

      return data;
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Consignment</DialogTitle>
          <DialogDescription>
            This action is irreversible — proceed carefully.
          </DialogDescription>
        </DialogHeader>

        {/* STAGE 0 — SEARCH FORM */}
        {stage === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Enter consignment UUID"
              value={serialKey}
              onChange={(e) => setSerialKey(e.target.value)}
              required
            />
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        )}

        {/* STAGE 1 — PREVIEW + DELETE CONFIRMATION */}
        {stage === 1 && product && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {product.client_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Added: {new Date(product.date_added).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Client ID</p>
                    <p className="text-sm font-medium">{product.client_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">UUID</p>
                    <p className="text-sm font-medium">{product.serial_key}</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action <strong>cannot be undone</strong>. Deleting this
                consignment will permanently remove it from the database.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStage(0)}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => handleDelete()}
              >
                <Trash2 className="h-4 w-4" />
                Delete Consignment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClient;
