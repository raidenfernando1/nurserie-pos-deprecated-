"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRightLeft, AlertCircle, Package, Warehouse } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePopupStore } from "@/store/popup-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MoveProductWarehouse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [sendStock, setSendStock] = useState("");
  const [stockThreshold, setStockThreshold] = useState("");
  const [warehouseList, setWarehouseList] = useState<any[]>([]);
  const [fetchingWarehouses, setFetchingWarehouses] = useState(true);

  const { data, closePopup } = usePopupStore();
  const { id } = useParams(); // Get warehouse ID from URL

  // Pull product from popup data
  const product = (data as { product: any })?.product;
  if (!product) return null;

  useEffect(() => {
    // Fetch warehouses directly
    const loadWarehouses = async () => {
      setFetchingWarehouses(true);
      try {
        const res = await fetch("/api/admin/warehouse");
        if (!res.ok) throw new Error("Failed to fetch warehouses");
        const data = await res.json();

        // Handle the response structure: { success: true, response: [...] }
        if (data.success && data.response) {
          setWarehouseList(data.response);
        }
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        setError("Failed to load warehouses");
      } finally {
        setFetchingWarehouses(false);
      }
    };

    loadWarehouses();
  }, []);

  const handleMove = async () => {
    if (!selectedWarehouse) {
      setError("Please select a destination warehouse");
      return;
    }

    if (!sendStock || Number(sendStock) <= 0) {
      setError("Please enter a valid stock amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/warehouse/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseID: id,
          productID: product.product_id,
          to_warehouseID: selectedWarehouse,
          send_stock: Number(sendStock),
          stock_threshold: Number(stockThreshold),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to move product");
      }

      const responseData = await res.json();
      console.log("Move response:", responseData);

      closePopup();
    } catch (err: any) {
      setError(err.message || "Failed to move product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Move Product Between Warehouses
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Transfer inventory from one warehouse to another
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 overflow-y-auto">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Card */}
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
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
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            <div className="p-5 space-y-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
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
                    Current Stock
                  </p>
                  <p className="text-base font-semibold">
                    {product.stock || 0} units
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Input Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sendStock">
                Amount to Send <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sendStock"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={sendStock}
                onChange={(e) => setSendStock(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockThreshold">Stock Threshold (Optional)</Label>
              <Input
                id="stockThreshold"
                type="number"
                min="0"
                placeholder="Minimum stock level"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Set a minimum stock level for alerts
              </p>
            </div>
          </div>

          {/* Warehouse Selection */}
          <div className="space-y-3">
            <Label>
              Select Destination Warehouse{" "}
              <span className="text-destructive">*</span>
            </Label>
            {fetchingWarehouses ? (
              <Alert>
                <Warehouse className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  Loading warehouses...
                </AlertDescription>
              </Alert>
            ) : warehouseList.length === 0 ? (
              <Alert>
                <Warehouse className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  No warehouses available
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-3">
                {warehouseList.map((warehouse: any) => (
                  <button
                    key={warehouse.warehouse_id}
                    type="button"
                    onClick={() => setSelectedWarehouse(warehouse.warehouse_id)}
                    disabled={loading}
                    className={`border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                      selectedWarehouse === warehouse.warehouse_id
                        ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/50"
                    } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedWarehouse === warehouse.warehouse_id
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <Warehouse
                          className={`h-5 w-5 ${
                            selectedWarehouse === warehouse.warehouse_id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">
                          {warehouse.warehouse_name || "Unnamed Warehouse"}
                        </h4>
                        {warehouse.location && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {warehouse.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={closePopup}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              className="flex-1 gap-2"
              disabled={loading || !selectedWarehouse}
            >
              <ArrowRightLeft className="h-4 w-4" />
              {loading ? "Moving..." : "Move Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveProductWarehouse;
