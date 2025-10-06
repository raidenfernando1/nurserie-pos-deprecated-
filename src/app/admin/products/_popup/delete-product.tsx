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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Search, Trash2, AlertCircle, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductStore } from "@/store/product-store";
import { Badge } from "@/components/ui/badge";

interface DeleteProductProps {
  onClose: () => void;
}

const DeleteProduct = ({ onClose }: DeleteProductProps) => {
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { deleteProduct } = useProductStore();

  const searchProduct = async () => {
    if (!sku.trim()) return;
    setLoading(true);
    setError(null);
    setProduct(null);

    try {
      const res = await fetch(`/api/product/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });

      if (!res.ok) throw new Error("Failed to search product.");

      const data = await res.json();
      if (!data || data.length === 0)
        throw new Error("No product found with this SKU.");

      setProduct(data[0]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.sku) return;
    setLoading(true);
    setError(null);

    try {
      await deleteProduct(product.sku, true);
      setProduct(null);
      setSku("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && sku.trim()) searchProduct();
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
                Search for a product by SKU to permanently remove it from the
                system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto">
          {/* Search Section */}
          <div className="space-y-3">
            <Label htmlFor="sku-search" className="text-sm font-medium">
              Product SKU
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="sku-search"
                  placeholder="Enter product SKU..."
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10"
                  disabled={loading}
                />
                <Package className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <Button
                onClick={searchProduct}
                disabled={loading || !sku.trim()}
                size="default"
                className="gap-2 min-w-[110px]"
              >
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Details Card */}
          {product && (
            <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
              <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                {/* Product Image */}
                {product.image_url ? (
                  <div className="relative aspect-video w-full bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold leading-tight">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description}
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
                        {product.sku}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Price
                      </p>
                      <p className="text-base font-semibold">
                        ₱{parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Brand
                      </p>
                      <p className="text-sm font-medium">{product.brand}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm font-medium">{product.category}</p>
                    </div>
                    {product.barcode && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Barcode
                        </p>
                        <Badge variant="outline" className="font-mono">
                          {product.barcode}
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
                  <strong className="font-semibold">Warning:</strong> This
                  action cannot be undone. This will permanently delete the
                  product and remove all associated data from the system.
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
          )}

          {/* Empty State */}
          {!loading && !product && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">Search for a product</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Enter a SKU to find and delete a product
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProduct;
