"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertCircle, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductStore } from "@/store/product-store";
import { Badge } from "@/components/ui/badge";

interface DeleteProductProps {
  onClose: () => void;
}

const DeleteProduct = ({ onClose }: DeleteProductProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedProduct } = useProductsPopups();
  const { deleteProduct } = useProductStore();

  if (!selectedProduct) return null;

  const handleDelete = async () => {
    if (!selectedProduct?.sku) return;
    setLoading(true);
    setError(null);

    try {
      await deleteProduct(selectedProduct.sku, true);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Delete Product
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Permanently remove this product from the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Details Card */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              {/* Product Image */}
              {selectedProduct.image_url ? (
                <div className="relative aspect-video w-full bg-muted">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                  <Package className="h-16 w-16" />
                </div>
              )}

              {/* Product Info */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold leading-tight">
                    {selectedProduct.name}
                  </h3>
                  {selectedProduct.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      SKU
                    </p>
                    <Badge variant="secondary" className="font-mono">
                      {selectedProduct.sku}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Price
                    </p>
                    <p className="text-base font-semibold">
                      ₱{Number(selectedProduct.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Brand
                    </p>
                    <p className="text-sm font-medium">
                      {selectedProduct.brand}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-sm font-medium">
                      {selectedProduct.category}
                    </p>
                  </div>
                  {selectedProduct.barcode && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Barcode
                      </p>
                      <Badge variant="outline" className="font-mono">
                        {selectedProduct.barcode}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <Alert
              variant="destructive"
              className="border-destructive/50 bg-destructive/5"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <strong className="font-semibold">Warning:</strong> This action
                cannot be undone. This will permanently delete the product and
                remove all associated data from the system.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1 gap-2"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                {loading ? "Deleting..." : "Delete Product"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProduct;
