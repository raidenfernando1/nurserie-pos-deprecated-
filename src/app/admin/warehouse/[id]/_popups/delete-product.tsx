"use client";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Loader2, Package } from "lucide-react";
import { usePopupStore } from "@/store/popup-store";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteProductFromWarehouse } from "../_action/addProductWarehouse";

export default function DeleteProductConfirmation() {
  const { data, closePopup } = usePopupStore();
  const { id } = useParams();
  const product = (data as { product: any })?.product;

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    console.log("=== DELETE PRODUCT STARTED ===");
    console.log("Warehouse ID from params:", id);
    console.log("Product data:", product);

    setIsDeleting(true);
    setError(null);

    try {
      const warehouseID = Number(id);
      const productID = product.product_id;

      console.log("Parsed warehouseID:", warehouseID);
      console.log("Parsed productID:", productID);
      console.log("Type of warehouseID:", typeof warehouseID);
      console.log("Type of productID:", typeof productID);

      console.log("Calling deleteProductFromWarehouse...");
      const result = await deleteProductFromWarehouse(warehouseID, productID);

      console.log("Delete result:", result);

      if (result.success) {
        console.log("✅ Delete successful:", result.message);
        toast.success(result.message);
        closePopup();
      } else {
        console.error("❌ Delete failed - result.success is false");
        throw new Error(result.message || "Delete operation returned failure");
      }
    } catch (err: any) {
      console.error("❌ DELETE ERROR:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);

      const errorMessage =
        err.message || "Failed to remove product from warehouse";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      console.log("=== DELETE PRODUCT ENDED ===");
    }
  };

  console.log("Component render - product:", product);
  console.log("Component render - warehouse id:", id);

  if (!product) {
    console.warn("⚠️ No product provided to DeleteProductConfirmation");
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                Confirm Deletion
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning Message */}
          <div className="bg-destructive/10 border-2 border-destructive/20 rounded-xl p-4">
            <p className="text-sm font-medium text-destructive">
              You are about to remove this product from the warehouse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This will remove all stock records associated with this product in
              this warehouse.
            </p>
          </div>

          {/* Product Preview */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product Details</h4>

            {/* Product Image */}
            <div className="flex justify-center bg-gradient-to-br from-muted/50 to-muted rounded-xl p-6 border">
              <div className="relative w-full max-w-xs aspect-square">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  ID: {product.id}
                </Badge>
              </div>

              {product.product_description && (
                <p className="text-sm text-muted-foreground">
                  {product.product_description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-muted/50 rounded-lg p-4 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Price
              </p>
              <p className="text-2xl font-bold text-primary">
                ₱{Number(product.price).toFixed(2)}
              </p>
            </div>

            <Separator />

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Brand
                </p>
                <p className="text-sm font-medium">{product.brand || "N/A"}</p>
              </div>

              <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Category
                </p>
                <p className="text-sm font-medium">
                  {product.category || "N/A"}
                </p>
              </div>

              <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  SKU
                </p>
                <p className="text-sm font-mono font-medium">
                  {product.sku || "N/A"}
                </p>
              </div>

              <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Barcode
                </p>
                <p className="text-sm font-mono font-medium">
                  {product.barcode || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => closePopup()}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Delete Product
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
