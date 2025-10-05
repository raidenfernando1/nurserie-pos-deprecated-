"use client";

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
import { Search, Trash2, AlertCircle, Package, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProducts, useWarehouseProducts } from "@/hooks/useProducts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DeleteWarehouseProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: string;
}

const DeleteWarehouseProduct = ({
  open,
  onOpenChange,
  warehouseId,
}: DeleteWarehouseProductProps) => {
  const { refetch } = useProducts();
  const { refetch: refetchWarehouse } = useWarehouseProducts({
    warehouseID: warehouseId,
  });

  const [sku, setSku] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setSku("");
    setProduct(null);
    setError(null);
    onOpenChange(false);
  };

  const searchProduct = async () => {
    if (!sku.trim()) return;

    setLoading(true);
    setProduct(null);
    setError(null);

    try {
      const response = await fetch("/api/product/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku }),
      });

      if (!response.ok) {
        setError("Failed to search product. Please try again.");
        return;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError("No product found with this SKU.");
        return;
      }

      setProduct(data[0]);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.sku) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.sku,
          isGlobal: false,
          warehouseId: warehouseId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to remove product from warehouse.");
        return;
      }

      await refetchWarehouse();
      handleClose();
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && sku.trim() && !loading) {
      searchProduct();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            Remove Product from Warehouse
          </DialogTitle>
          <DialogDescription>
            Search for a product by SKU to remove it from this warehouse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="sku-search">Product SKU</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sku-search"
                  placeholder="Enter product SKU..."
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-10"
                  disabled={loading || isDeleting}
                />
              </div>
              <Button
                onClick={searchProduct}
                disabled={loading || !sku.trim() || isDeleting}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Display */}
          {product && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <Separator />

              <div className="border rounded-lg overflow-hidden">
                {/* Product Image */}
                {product.image_url && (
                  <div className="relative aspect-video w-full bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Product Details */}
                <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <Badge variant="secondary" className="shrink-0">
                        ${parseFloat(product.price).toFixed(2)}
                      </Badge>
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">SKU</p>
                      <p className="text-sm font-medium">{product.sku}</p>
                    </div>
                    {product.barcode && (
                      <div>
                        <p className="text-xs text-muted-foreground">Barcode</p>
                        <p className="text-sm font-medium font-mono">
                          {product.barcode}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Brand</p>
                      <p className="text-sm font-medium">{product.brand}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">{product.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Alert */}
              <Alert variant="destructive" className="border-destructive/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will remove the product from this warehouse. This action
                  cannot be undone.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
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
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Remove from Warehouse
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !product && !error && sku && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Enter a SKU and click search</p>
            </div>
          )}

          {/* Initial Empty State */}
          {!loading && !product && !error && !sku && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Search for a product to remove</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWarehouseProduct;
