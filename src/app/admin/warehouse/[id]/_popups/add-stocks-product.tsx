"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Package2, Loader2, Scan, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { usePopupStore } from "@/store/popup-store";
import { addStockToWarehouse } from "../_action/addProductWarehouse";
import { toast } from "sonner";
import type { AddStockPayload } from "../_action/addProductWarehouse";

const AddStockPopup = () => {
  const params = useParams();
  const warehouseID = params.id as string;

  const { data, closePopup } = usePopupStore();
  const product = (data as { product: any })?.product;

  const [step, setStep] = useState(0);
  const [stockToAdd, setStockToAdd] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 0 && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [step]);

  const handleBarcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && barcodeInput.trim()) {
      if (product.barcode && barcodeInput.trim() === product.barcode) {
        setStockToAdd((prev) => prev + 1);
        setBarcodeInput("");
        setError(null);
      } else {
        setError("Barcode does not match this product");
        setBarcodeInput("");
      }
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!warehouseID) {
      setError("Warehouse ID not found");
      return;
    }

    if (stockToAdd === 0) {
      setError("Please scan at least one item");
      return;
    }

    setIsLoading(true);

    try {
      const payload: AddStockPayload = {
        warehouseID: warehouseID,
        sku: product.sku,
        stockToAdd,
      };

      await addStockToWarehouse(payload);
      toast.success(`Successfully added ${stockToAdd} units to stock`);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stock");
      toast.error(err instanceof Error ? err.message : "Failed to add stock");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setStockToAdd(0);
    setBarcodeInput("");
    setError(null);
    closePopup();
  };

  if (!product) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold">
                    Add Stock
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Scan items to add to existing inventory
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in-50">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Product Preview */}
              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-4 p-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package2 className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.brand}
                        </p>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        SKU: <span className="font-mono">{product.sku}</span>
                      </span>
                      {product.barcode && (
                        <>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Barcode:{" "}
                            <span className="font-mono">{product.barcode}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Stock Info */}
                {product.stock !== undefined && (
                  <div className="px-4 py-3 bg-muted/50 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Current Stock
                      </span>
                      <span className="text-sm font-semibold">
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Barcode Scanner Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Scan Barcode</Label>
                  <div className="relative">
                    <Scan className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={barcodeInputRef}
                      id="barcode"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyPress={handleBarcodeKeyPress}
                      placeholder="Scan or enter barcode..."
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scan items to increment stock count. Press Enter after each
                    scan.
                  </p>
                </div>

                {/* Stock Counter */}
                <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Stock to Add
                  </p>
                  <p className="text-5xl font-bold text-primary">
                    +{stockToAdd}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    items scanned
                  </p>
                  {product.stock !== undefined && stockToAdd > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        New Total:{" "}
                        <span className="font-semibold text-foreground">
                          {product.stock + stockToAdd} units
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => closePopup()}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={isLoading || stockToAdd === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Stock...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stock
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Success!
              </DialogTitle>
            </div>

            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Package2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Stock Added Successfully!</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600">
                    +{stockToAdd} units
                  </span>{" "}
                  of {product?.name} have been added to the warehouse.
                </p>
                {product.stock !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Total stock is now{" "}
                    <span className="font-semibold text-foreground">
                      {product.stock + stockToAdd} units
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetAndClose} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setStockToAdd(0);
                  setBarcodeInput("");
                  setError(null);
                }}
                className="flex-1"
              >
                Add More Stock
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStockPopup;
