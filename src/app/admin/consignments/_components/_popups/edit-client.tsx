"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useClient from "../../_store/useClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save } from "lucide-react";

interface EditClientProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditClient = ({ open, onOpenChange }: EditClientProps) => {
  const [serialKey, setSerialKey] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [stage, setStage] = useState<0 | 1>(0); // 0 = search, 1 = edit form
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [codeName, setCodeName] = useState("");

  const { updateClient, fetchClients, findClient } = useClient();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const client = await findClient(serialKey);

      if (client) {
        setProduct(client);
        setName(client.name || "");
        setCodeName(client.code_name || "");
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

  const handleUpdate = async () => {
    if (!product?.serial_key) return;

    // Validate at least one field is changed
    if (
      name === (product.name || "") &&
      codeName === (product.code_name || "")
    ) {
      alert("No changes detected.");
      return;
    }

    setLoading(true);
    try {
      const updates: any = {};
      if (name !== (product.name || "")) updates.name = name;
      if (codeName !== (product.code_name || "")) updates.code_name = codeName;

      const result = await updateClient(product.serial_key, updates);

      if (result) {
        alert("Client updated successfully.");
        fetchClients();
        onOpenChange(false);
        resetForm();
      } else {
        alert("Failed to update client.");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSerialKey("");
    setProduct(null);
    setName("");
    setCodeName("");
    setStage(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update client name or code name for this consignment.
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
            <div>
              <Label htmlFor="search-uuid">Consignment UUID</Label>
              <Input
                id="search-uuid"
                placeholder="Enter consignment UUID"
                value={serialKey}
                onChange={(e) => setSerialKey(e.target.value)}
                required
              />
            </div>
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

        {/* STAGE 1 — EDIT FORM */}
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

            <Alert className="border-blue-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Modify the fields below. Leave empty to keep current values.
              </AlertDescription>
            </Alert>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="edit-name">Client Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter new client name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="edit-codename">Code Name</Label>
                <Input
                  id="edit-codename"
                  placeholder="Enter new code name"
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStage(0)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditClient;
