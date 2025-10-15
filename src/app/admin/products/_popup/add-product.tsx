"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Package, Loader2 } from "lucide-react";
import { useState } from "react";
import { useProductStore } from "@/store/product-store";
import { usePopupStore } from "@/store/popup-store";

const AddProduct = () => {
  const { createProduct } = useProductStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { activePopup, closePopup } = usePopupStore();

  const [formData, setFormData] = useState({
    sku: "",
    barcode: "",
    name: "",
    price: "",
    category: "",
    brand: "",
    imageUrl: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      barcode: "",
      name: "",
      price: "",
      category: "",
      brand: "",
      imageUrl: "",
      description: "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const {
        sku,
        barcode,
        name,
        price,
        category,
        brand,
        imageUrl,
        description,
      } = formData;

      if (!sku || !barcode || !name || !price || !category || !brand) {
        throw new Error("Please fill in all required fields");
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error("Please enter a valid price");
      }

      const productData = {
        sku: sku.trim(),
        barcode: barcode.trim(),
        name: name.trim(),
        price: parsedPrice,
        category: category.trim(),
        brand: brand.trim(),
        image_url: imageUrl.trim(),
        description: description.trim(),
      };

      await createProduct(productData);
      setShowSuccess(true);
    } catch (error) {
      console.error("❌ Error creating product:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-semibold">
                  New Product
                </DialogTitle>
                <Badge variant="secondary">Create Product</Badge>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Enter SKU"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      placeholder="Enter barcode"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={handleChange}
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
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    rows={3}
                    disabled={isLoading}
                  />
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
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl font-semibold">
                Product Created!
              </DialogTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center space-y-4 py-6">
              <Package className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">
                Product Added Successfully!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your product has been added to the inventory.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => closePopup()} className="flex-1">
                Done
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowSuccess(false);
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

export default AddProduct;
