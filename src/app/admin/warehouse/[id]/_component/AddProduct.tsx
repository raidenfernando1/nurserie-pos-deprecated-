import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Package, Search, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { createWarehouseProduct } from "@/hooks/useProducts";
import { useWarehouseProducts } from "@/hooks/useProducts";

const AddProduct = ({
  onClose,
  warehouseId,
}: {
  onClose: () => void;
  warehouseId: number;
}) => {
  const { refetch } = useWarehouseProducts({ warehouseID: warehouseId });

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [threshold, setThreshold] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setSku("");
    setBarcode("");
    setName("");
    setPrice("");
    setCategory("");
    setBrand("");
    setImageUrl("");
    setInitialStock("");
    setThreshold("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (
        !name.trim() ||
        !brand.trim() ||
        !category.trim() ||
        !sku.trim() ||
        !price.trim() ||
        !initialStock.trim() ||
        !threshold.trim()
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Parse and validate numbers
      const parsedPrice = parseFloat(price);
      const parsedInitialStock = parseInt(initialStock);
      const parsedThreshold = parseInt(threshold);

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error("Please enter a valid price");
      }
      if (isNaN(parsedInitialStock) || parsedInitialStock < 0) {
        throw new Error("Please enter a valid initial stock amount");
      }
      if (isNaN(parsedThreshold) || parsedThreshold < 0) {
        throw new Error("Please enter a valid threshold amount");
      }

      const productData = {
        name: name.trim(),
        description: description.trim() || undefined,
        brand: brand.trim(),
        category: category.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        price: parsedPrice,
        image_url: imageUrl.trim() || undefined,
        initial_stock: parsedInitialStock,
        stock_threshold: parsedThreshold,
      };

      console.log("Sending product data:", productData); // Debug log

      const result = await createWarehouseProduct({
        warehouseID: warehouseId,
        productData,
      });

      console.log("Product created successfully:", result);
      setStep(2);
    } catch (error) {
      console.error("Error creating product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create product",
      );
    } finally {
      await refetch();
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {step === 0 && (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Add Product</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose how you'd like to add a product to your inventory.
            </p>
            <div className="grid gap-3">
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
                onClick={() => setStep(2)}
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
          </CardContent>
        </Card>
      )}

      {/* Step 1: New Product Form */}
      {step === 1 && (
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
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
              <CardTitle className="text-xl font-semibold">
                New Product
              </CardTitle>
              <Badge variant="secondary">Step 1 of 2</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Enter SKU"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Enter barcode"
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Separator />

              {/* Inventory Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Inventory Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialStock">Initial Stock *</Label>
                    <Input
                      id="initialStock"
                      type="number"
                      min="0"
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      placeholder="0"
                      required
                      disabled={isLoading}
                    />
                  </div>
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Success Confirmation */}
      {step === 2 && (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Product Created!
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">
                Product Added Successfully!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your product has been added to the inventory.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={onClose} className="flex-1">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddProduct;
