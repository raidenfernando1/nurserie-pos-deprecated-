"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, Package, X, Loader2, AlertCircle } from "lucide-react";
import { usePopupStore } from "@/store/popup-store";
import { getAssignedSkus, assignSku } from "../_action/assignSKU";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ProductDetailPopup = () => {
  const { data, closePopup } = usePopupStore();
  const product = (data as { product: any })?.product;

  const [assignedSkus, setAssignedSkus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newSku, setNewSku] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assigned SKUs on mount
  useEffect(() => {
    const fetchSkus = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getAssignedSkus(product.id);
      if (result.success && result.assignedSkus) {
        setAssignedSkus(
          result.assignedSkus.map((row: any) => row.assigned_sku),
        );
      } else if (result.error) {
        setError(result.error);
      }
      setIsLoading(false);
    };

    if (product?.id) {
      fetchSkus();
    }
  }, [product?.id]);

  const handleAssignSku = async () => {
    if (!newSku.trim()) {
      toast.error("Please enter a SKU");
      return;
    }

    setIsSubmitting(true);
    const result = await assignSku(product.id, newSku.trim());

    if (result.success) {
      toast.success("SKU assigned successfully");
      setAssignedSkus([...assignedSkus, newSku.trim()]);
      setNewSku("");
      setShowInput(false);
    } else {
      toast.error(result.error || "Failed to assign SKU");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold">
                {product.name}
              </DialogTitle>
              <Badge variant="secondary" className="font-mono">
                Product ID: {product.id}
              </Badge>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Product Image */}
          <div className="flex justify-center bg-gradient-to-br from-muted/50 to-muted rounded-xl p-8 border">
            <div className="relative w-full max-w-sm aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Product Name & Description */}
          <div className="space-y-3">
            <h3 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h3>
            {product.product_description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.product_description}
              </p>
            )}
          </div>

          {/* Price Highlight */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Price
            </p>
            <p className="text-4xl font-bold text-primary">
              ₱{Number(product.price).toFixed(2)}
            </p>
          </div>

          <Separator />

          {/* Product Details Grid */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Brand
                </p>
                <p className="text-base font-medium">
                  {product.brand || "N/A"}
                </p>
              </div>

              <div className="space-y-1.5 p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Category
                </p>
                <p className="text-base font-medium">
                  {product.category || "N/A"}
                </p>
              </div>

              <div className="space-y-1.5 p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Main SKU
                </p>
                <p className="text-base font-mono font-medium">
                  {product.sku || "N/A"}
                </p>
              </div>

              <div className="space-y-1.5 p-4 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Barcode
                </p>
                <p className="text-base font-mono font-medium">
                  {product.barcode || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assigned SKUs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Assigned SKUs</h4>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setShowInput(!showInput)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Assign SKU
              </Button>
            </div>

            {/* Input for new SKU */}
            {showInput && (
              <div className="flex gap-2 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <Input
                  placeholder="Enter SKU"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAssignSku();
                    }
                  }}
                  className="font-mono"
                  disabled={isSubmitting}
                  autoFocus
                />
                <Button
                  onClick={handleAssignSku}
                  disabled={isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInput(false);
                    setNewSku("");
                  }}
                  size="sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Failed to load SKUs
                  </p>
                  <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading assigned SKUs...
                </p>
              </div>
            ) : assignedSkus.length > 0 ? (
              <div className="grid gap-3">
                {assignedSkus.map((assignedSku) => (
                  <div
                    key={assignedSku}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Badge
                      variant="outline"
                      className="font-mono text-sm px-3 py-1"
                    >
                      {assignedSku}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        toast.info("Delete functionality coming soon");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-muted rounded-full">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No additional SKUs assigned
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Click "Assign SKU" to add more SKUs to this product
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => closePopup()}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailPopup;
