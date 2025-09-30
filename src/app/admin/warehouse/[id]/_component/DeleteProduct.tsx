"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Search, Trash2, AlertCircle, Package } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWarehouseProducts } from "@/hooks/useProducts";

const DeleteProduct = ({
  onClose,
  warehouseId,
}: {
  onClose: () => void;
  warehouseId: number;
}) => {
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProduct = async () => {
    if (!sku.trim()) return;

    setLoading(true);
    setProduct(null);
    setError(null);

    try {
      const response = await fetch("/api/product/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku, warehouse_id: warehouseId }),
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

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/product/search", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: product.sku, warehouse_id: warehouseId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to delete product.");
        return;
      }

      setProduct(null);
      setSku("");
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && sku.trim()) {
      searchProduct();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Delete Product
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-6 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Search for a product by SKU to view details and confirm deletion.
          </p>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter product SKU..."
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Package className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              onClick={searchProduct}
              disabled={loading || !sku.trim()}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
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
              <div className="border rounded-lg overflow-hidden">
                {/* Product Image */}
                {product.image_url && (
                  <div className="relative aspect-video w-full bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">SKU</p>
                      <p className="text-sm font-medium">{product.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm font-medium">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
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
                  This action cannot be undone. This will permanently delete the
                  product from the warehouse.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Product
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !product && !error && sku && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Enter a SKU and click search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteProduct;
