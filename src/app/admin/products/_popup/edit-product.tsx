"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, PhilippinePeso } from "lucide-react";
import { usePopupStore } from "@/store/popup-store";
import { useProductStore } from "@/store/product-store";
import { updateProductAction } from "../_action/editProduct";

const EditProductPopup = () => {
  const { data, closePopup } = usePopupStore();
  const updateProductInStore = useProductStore((state) => state.updateProduct);

  const product = (data as { product: any })?.product;
  if (!product) return null;

  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    brand: product.brand || "",
    category: product.category || "",
    price: product.price?.toString() || "",
    cost: product.cost?.toString() || "",
    image_url: product.image_url || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!product.sku) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    // Store original product for rollback
    const originalProduct = { ...product };

    try {
      const updateData: any = {};

      if (formData.name && formData.name !== product.name)
        updateData.name = formData.name;
      if (formData.description && formData.description !== product.description)
        updateData.description = formData.description;
      if (formData.brand && formData.brand !== product.brand)
        updateData.brand = formData.brand;
      if (formData.category && formData.category !== product.category)
        updateData.category = formData.category;
      if (formData.price && parseFloat(formData.price) !== product.price)
        updateData.price = parseFloat(formData.price);
      if (formData.cost && parseFloat(formData.cost) !== product.cost)
        updateData.cost = parseFloat(formData.cost);
      if (formData.image_url && formData.image_url !== product.image_url)
        updateData.image_url = formData.image_url;

      updateProductInStore(product.sku, updateData);

      const result = await updateProductAction(product.sku, updateData);

      if (!result.success) {
        updateProductInStore(product.sku, originalProduct);
        setError(result.error || "Failed to update product");
      } else {
        if (result.product) {
          updateProductInStore(product.sku, result.product);
        }
        setSuccess(true);
        setTimeout(() => closePopup(), 2000);
      }
    } catch (err: any) {
      console.error(err);
      // Rollback on exception
      updateProductInStore(product.sku, originalProduct);
      setError(err.message || "An error occurred while updating.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && closePopup()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details for SKU: {product.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Product updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
            />
          </div>

          {formData.image_url && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <img
                  src={formData.image_url}
                  alt="Product preview"
                  className="max-h-40 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdate} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
            <Button variant="outline" onClick={closePopup} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductPopup;
