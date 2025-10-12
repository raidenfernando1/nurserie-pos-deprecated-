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
import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductStore } from "@/store/product-store";
import useProductsPopups from "../_store/products-popups";

const EditProduct = ({ onClose }: { onClose: () => void }) => {
  const { selectedProduct } = useProductsPopups();
  const { editProduct } = useProductStore();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    image_url: "",
  });

  // Populate form with selected product data
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        brand: selectedProduct.brand || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price?.toString() || "",
        image_url: selectedProduct.image_url || "",
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedProduct?.sku) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Build update object with only changed fields
      const updateData: {
        name?: string;
        description?: string;
        brand?: string;
        category?: string;
        price?: number;
        image_url?: string;
      } = {};

      if (formData.name && formData.name !== selectedProduct.name) {
        updateData.name = formData.name;
      }
      if (
        formData.description &&
        formData.description !== selectedProduct.description
      ) {
        updateData.description = formData.description;
      }
      if (formData.brand && formData.brand !== selectedProduct.brand) {
        updateData.brand = formData.brand;
      }
      if (formData.category && formData.category !== selectedProduct.category) {
        updateData.category = formData.category;
      }
      if (
        formData.price &&
        parseFloat(formData.price) !== selectedProduct.price
      ) {
        updateData.price = parseFloat(formData.price);
      }
      if (
        formData.image_url &&
        formData.image_url !== selectedProduct.image_url
      ) {
        updateData.image_url = formData.image_url;
      }

      await editProduct(selectedProduct.sku, updateData);

      setSuccess(true);

      // Show success message for 2 seconds then close
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!selectedProduct) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details for SKU: {selectedProduct.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Product updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Edit Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
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
                  placeholder="Enter brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>

            {/* Preview Image */}
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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
