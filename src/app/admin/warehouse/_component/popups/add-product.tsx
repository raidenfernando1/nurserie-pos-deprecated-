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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Search,
  ArrowLeft,
  Loader2,
  Scan,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  createWarehouseProduct,
  useWarehouseProducts,
} from "@/hooks/useProducts";
import ProductList from "./_component/add-product-list";

interface AddProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouseId: string;
}

const AddProduct = ({ open, onOpenChange, warehouseId }: AddProductProps) => {
  const { refetch } = useWarehouseProducts({ warehouseID: warehouseId });
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 5>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sku, setSku] = useState("");
  const [productBarcode, setProductBarcode] = useState(""); // The actual product barcode
  const [scanCount, setScanCount] = useState(0); // Number of times scanned
  const [tempBarcodeInput, setTempBarcodeInput] = useState(""); // Temporary input field value
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [threshold, setThreshold] = useState("");
  const [description, setDescription] = useState("");

  // Auto-focus barcode input when entering step 3
  useEffect(() => {
    if (step === 3 && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [step]);

  const resetForm = () => {
    setSku("");
    setProductBarcode("");
    setScanCount(0);
    setTempBarcodeInput("");
    setName("");
    setPrice("");
    setCategory("");
    setBrand("");
    setImageUrl("");
    setThreshold("");
    setDescription("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    setStep(0);
    onOpenChange(false);
  };

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When Enter is pressed, process the barcode
    if (e.key === "Enter") {
      e.preventDefault();
      const barcodeValue = tempBarcodeInput.trim();

      if (barcodeValue) {
        if (!productBarcode) {
          // First scan - set the product barcode
          setProductBarcode(barcodeValue);
          setScanCount(1);
        } else if (barcodeValue === productBarcode) {
          // Same barcode - increment count
          setScanCount((prev) => prev + 1);
        } else {
          // Different barcode - show warning
          setError(`Barcode mismatch! Expected: ${productBarcode}`);
          setTimeout(() => setError(null), 3000);
        }
        setTempBarcodeInput(""); // Clear input for next scan
      }
    }
  };

  const handleManualAdd = () => {
    const barcodeValue = tempBarcodeInput.trim();

    if (barcodeValue) {
      if (!productBarcode) {
        setProductBarcode(barcodeValue);
        setScanCount(1);
      } else if (barcodeValue === productBarcode) {
        setScanCount((prev) => prev + 1);
      } else {
        setError(`Barcode mismatch! Expected: ${productBarcode}`);
        setTimeout(() => setError(null), 3000);
      }
      setTempBarcodeInput("");
      barcodeInputRef.current?.focus();
    }
  };

  const incrementCount = () => {
    setScanCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    setScanCount((prev) => Math.max(0, prev - 1));
  };

  const resetScanning = () => {
    setProductBarcode("");
    setScanCount(0);
    setTempBarcodeInput("");
    setError(null);
    barcodeInputRef.current?.focus();
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !name.trim() ||
      !brand.trim() ||
      !category.trim() ||
      !sku.trim() ||
      !price.trim() ||
      !threshold.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedThreshold = parseInt(threshold);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price");
      return;
    }
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError("Please enter a valid threshold amount");
      return;
    }

    // Move to barcode scanning step
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!productBarcode) {
        throw new Error("Please scan the product barcode");
      }

      if (scanCount === 0) {
        throw new Error("Stock count cannot be 0");
      }

      const parsedPrice = parseFloat(price);
      const parsedThreshold = parseInt(threshold);

      const productData = {
        name: name.trim(),
        description: description.trim() || undefined,
        brand: brand.trim(),
        category: category.trim(),
        sku: sku.trim(),
        barcode: productBarcode,
        price: parsedPrice,
        image_url: imageUrl.trim() || undefined,
        initial_stock: scanCount,
        stock_threshold: parsedThreshold,
      };

      const result = await createWarehouseProduct({
        warehouseID: warehouseId,
        productData,
      });

      if (!result || result.error) {
        throw new Error(result?.error || "Failed to create product");
      }

      await refetch();
      setStep(2);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Step 0: Choose Product Type */}
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Choose how you'd like to add a product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Button
                onClick={() => setStep(1)}
                className="justify-start h-12"
                variant="outline"
              >
                <Package className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">New Product</div>
                  <div className="text-xs text-muted-foreground">
                    Create a brand new product
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => setStep(5)}
                className="justify-start h-12"
                variant="outline"
              >
                <Search className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">Existing Product</div>
                  <div className="text-xs text-muted-foreground">
                    Add stock to existing item
                  </div>
                </div>
              </Button>
            </div>
          </>
        )}

        {/* Step 1: New Product Form (Without Barcode) */}
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(0)}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>New Product Details</DialogTitle>
                  <DialogDescription>
                    Fill in the product details. Barcode scanning comes next.
                  </DialogDescription>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Step 1 of 3
                </Badge>
              </div>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Enter SKU"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Enter category"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Enter brand"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Inventory Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Inventory Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold *</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="5"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Initial stock will be counted in the next step via barcode
                    scanning
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Reset Form
                </Button>
                <Button type="submit" className="flex-1">
                  Next: Scan Barcode
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Barcode Scanning */}
        {step === 3 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Scan Product Barcode</DialogTitle>
                  <DialogDescription>
                    Scan the same barcode multiple times to count your
                    inventory.
                  </DialogDescription>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Step 2 of 3
                </Badge>
              </div>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-6 py-4">
              {/* Barcode Scanner Input */}
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode Scanner</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Scan className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={barcodeInputRef}
                      id="barcode"
                      value={tempBarcodeInput}
                      onChange={(e) => setTempBarcodeInput(e.target.value)}
                      onKeyDown={handleBarcodeInput}
                      placeholder={
                        productBarcode
                          ? `Scan ${productBarcode} to add more`
                          : "Scan or type barcode and press Enter"
                      }
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleManualAdd}
                    disabled={!tempBarcodeInput.trim() || isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep scanning the same barcode to increase the stock count
                </p>
              </div>

              {/* Stock Counter Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Current Stock Count</Label>
                  {productBarcode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetScanning}
                      disabled={isLoading}
                    >
                      Reset Scanning
                    </Button>
                  )}
                </div>

                {!productBarcode ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Scan className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Scan the product barcode to begin counting
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-6 space-y-4">
                    {/* Product Barcode */}
                    <div className="text-center space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Product Barcode
                      </Label>
                      <div className="font-mono text-lg font-semibold">
                        {productBarcode}
                      </div>
                    </div>

                    <Separator />

                    {/* Stock Counter */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={decrementCount}
                        disabled={scanCount === 0 || isLoading}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>

                      <div className="text-center min-w-[120px]">
                        <div className="text-5xl font-bold text-primary">
                          {scanCount}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          units in stock
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={incrementCount}
                        disabled={isLoading}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Scan to auto-increment or use +/- buttons
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back to Details
                </Button>
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1"
                  disabled={!productBarcode || scanCount === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      Create Product ({scanCount}{" "}
                      {scanCount === 1 ? "unit" : "units"})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Success Confirmation */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Product Created!</DialogTitle>
              <DialogDescription>
                Your product has been added to the inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <Package className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">
                Product Added Successfully!
              </h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{scanCount} units</p>
                <p className="text-sm text-muted-foreground">
                  Barcode: {productBarcode}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setStep(1);
                }}
                className="flex-1"
              >
                Add Another
              </Button>
            </div>
          </>
        )}

        {/* Step 5: Existing Product List */}
        {step === 5 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(0)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Select Product</DialogTitle>
                  <DialogDescription>
                    Choose an existing product to add stock.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ProductList />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
