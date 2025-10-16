"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Search, Package2, Loader2, Scan } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/product-store";
import { useWarehouseStore } from "@/store/warehouse-store";
import { usePopupStore } from "@/store/popup-store";

const AddWarehouseProduct = () => {
  const params = useParams();
  const warehouseID = params.id as string;

  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stock, setStock] = useState(0);
  const [stockThreshold, setStockThreshold] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const { fetchAllProducts, fetchProduct, products } = useProductStore();
  const { addProductToWarehouse } = useWarehouseStore();
  const { closePopup } = usePopupStore();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      await fetchAllProducts();
      setIsLoadingProducts(false);
    };
    loadProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    if (step === 2 && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [step]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleProductClick = async (sku: string) => {
    const productData = await fetchProduct(sku);
    setSelectedProduct(productData);
    setStep(1);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setStock(0);
      setStockThreshold("");
      setBarcodeInput("");
      setError(null);
    } else if (step === 1) {
      setSelectedProduct(null);
      setStep(0);
    }
  };

  const handleConfirmProduct = () => {
    setStep(2);
    setStock(0);
    setStockThreshold("");
    setBarcodeInput("");
    setError(null);
  };

  const handleBarcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && barcodeInput.trim()) {
      if (
        selectedProduct.barcode &&
        barcodeInput.trim() === selectedProduct.barcode
      ) {
        setStock((prev) => prev + 1);
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

    if (stock === 0) {
      setError("Please scan at least one item");
      return;
    }

    if (!stockThreshold.trim()) {
      setError("Please enter a stock threshold");
      return;
    }

    const parsedThreshold = parseInt(stockThreshold);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError("Please enter a valid threshold");
      return;
    }

    setIsLoading(true);

    try {
      await addProductToWarehouse({
        warehouseID: parseInt(warehouseID),
        sku: selectedProduct.sku,
        stock: stock,
        stock_threshold: parsedThreshold,
      });

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(0);
    setSelectedProduct(null);
    setStock(0);
    setStockThreshold("");
    setBarcodeInput("");
    setError(null);
    closePopup();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className=" max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        {step === 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package2 className="h-5 w-5 text-primary" />
                <DialogTitle className="text-xl font-semibold">
                  Select Product
                </DialogTitle>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading products...
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                {/* Search Bar */}
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, brand, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between flex-shrink-0">
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <div
                        key={index}
                        onClick={() => handleProductClick(product.sku)}
                        className="group p-4 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package2 className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {product.brand}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-muted-foreground">
                                SKU:{" "}
                                <span className="font-mono">{product.sku}</span>
                              </span>
                              {product.price && (
                                <>
                                  <span className="text-xs text-muted-foreground">
                                    •
                                  </span>
                                  <span className="text-xs font-medium text-primary">
                                    ₱{product.price}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Package2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No products found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {step === 1 && selectedProduct && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-xl font-semibold">
                  Product Details
                </DialogTitle>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto flex-1">
              {/* Product Image and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Section */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                    {selectedProduct.image_url ? (
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <Package2 className="h-20 w-20 text-muted-foreground/50" />
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {selectedProduct.brand}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="secondary">
                        {selectedProduct.category}
                      </Badge>
                      {selectedProduct.price && (
                        <Badge
                          variant="outline"
                          className="text-primary font-semibold"
                        >
                          ₱{selectedProduct.price}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    SKU
                  </p>
                  <p className="font-mono text-sm font-medium">
                    {selectedProduct.sku}
                  </p>
                </div>

                {selectedProduct.barcode && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Barcode
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {selectedProduct.barcode}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button onClick={handleConfirmProduct} className="w-full">
                  Continue to Stock Entry
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 2 && selectedProduct && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-xl font-semibold">
                  Stock Entry
                </DialogTitle>
                <Badge variant="secondary">Step 2 of 2</Badge>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto flex-1 px-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Product Summary */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-background flex items-center justify-center">
                  {selectedProduct.image_url ? (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.brand} • SKU: {selectedProduct.sku}
                  </p>
                </div>
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
                    Current Stock Count
                  </p>
                  <p className="text-5xl font-bold text-primary">{stock}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    items scanned
                  </p>
                </div>

                {/* Stock Threshold */}
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold *</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(e.target.value)}
                    placeholder="Enter threshold amount"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll be notified when stock falls below this amount
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isLoading || stock === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    "Add to Warehouse"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
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
              <h3 className="text-lg font-medium">
                Product Added Successfully!
              </h3>
              <p className="text-sm text-muted-foreground">
                {stock} units of {selectedProduct?.name} have been added to the
                warehouse.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetAndClose} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setSelectedProduct(null);
                  setStock(0);
                  setStockThreshold("");
                  setBarcodeInput("");
                  setError(null);
                }}
                className="flex-1"
              >
                Add Another
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseProduct;
