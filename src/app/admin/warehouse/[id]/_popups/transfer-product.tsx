"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Package2,
  Loader2,
  Scan,
  ArrowRightLeft,
  Store,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { usePopupStore } from "@/store/popup-store";
import { transferProductToStore } from "../_action/transferProductToStore";
import { toast } from "sonner";
import type { TransferProductToStorePayload } from "../_action/transferProductToStore";

const TransferToStorePopup = () => {
  const params = useParams();
  const warehouseID = params.id as string;

  const { data, closePopup } = usePopupStore();
  const product = (data as { product: any })?.product;
  const storeID = (data as { storeID: number })?.storeID;

  const [step, setStep] = useState(0);
  const [quantityToTransfer, setQuantityToTransfer] = useState(0);
  const [threshold, setThreshold] = useState(0);
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
        if (quantityToTransfer + 1 > product.stock) {
          setError("Cannot transfer more than available stock");
          setBarcodeInput("");
        } else {
          setQuantityToTransfer((prev) => prev + 1);
          setBarcodeInput("");
          setError(null);
        }
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

    if (!storeID) {
      setError("Store ID not found");
      return;
    }

    if (quantityToTransfer === 0) {
      setError("Please scan at least one item");
      return;
    }

    if (quantityToTransfer > product.stock) {
      setError("Cannot transfer more than available stock");
      return;
    }

    if (threshold < 0) {
      setError("Threshold cannot be negative");
      return;
    }

    setIsLoading(true);

    try {
      const payload: TransferProductToStorePayload = {
        warehouseID: parseInt(warehouseID),
        storeID: storeID,
        sku: product.sku,
        quantity: quantityToTransfer,
        threshold: threshold,
      };

      await transferProductToStore(payload);
      toast.success(
        `Successfully transferred ${quantityToTransfer} units to store`,
      );
      setStep(1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to transfer product",
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to transfer product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setQuantityToTransfer(0);
    setThreshold(0);
    setBarcodeInput("");
    setError(null);
    closePopup();
  };

  if (!product || !storeID) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold">
                    Transfer to Store
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Scan items to transfer from warehouse to store
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
                        Available in Warehouse
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
                    Scan items to increment transfer count. Press Enter after
                    each scan.
                  </p>
                </div>

                {/* Transfer Counter */}
                <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Quantity to Transfer
                  </p>
                  <p className="text-5xl font-bold text-primary">
                    {quantityToTransfer}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    items scanned
                  </p>
                  {product.stock !== undefined && quantityToTransfer > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        Remaining in Warehouse:{" "}
                        <span className="font-semibold text-foreground">
                          {product.stock - quantityToTransfer} units
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Threshold Section */}
                {/* Threshold Section */}
                <div className="space-y-2">
                  <Label
                    htmlFor="threshold"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    value={threshold === 0 ? "" : threshold}
                    onChange={(e) => {
                      const val = e.target.value;
                      setThreshold(val === "" ? 0 : parseInt(val));
                    }}
                    placeholder="Enter threshold value..."
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cashier will be notified when stock falls to or below this
                    level. Set to 0 to disable notifications.
                  </p>
                  {threshold > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-xs text-amber-800">
                        <strong>Alert:</strong> Cashier will be warned when
                        stock reaches{" "}
                        <span className="font-semibold">{threshold} units</span>{" "}
                        or less
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
                  disabled={isLoading || quantityToTransfer === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Store className="mr-2 h-4 w-4" />
                      Transfer to Store
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
                <Store className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">
                Transfer Completed Successfully!
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600">
                    {quantityToTransfer} units
                  </span>{" "}
                  of {product?.name} have been transferred to the store.
                </p>
                {product.stock !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Warehouse stock is now{" "}
                    <span className="font-semibold text-foreground">
                      {product.stock - quantityToTransfer} units
                    </span>
                  </p>
                )}
                {threshold > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-xs text-amber-800">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      Low stock threshold set to{" "}
                      <strong>{threshold} units</strong>
                    </p>
                  </div>
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
                  setQuantityToTransfer(0);
                  setThreshold(0);
                  setBarcodeInput("");
                  setError(null);
                }}
                className="flex-1"
              >
                Transfer More
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferToStorePopup;
