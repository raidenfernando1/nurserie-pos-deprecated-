import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Search, Edit, AlertCircle, Package } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  sku: string;
  price: number;
  image_url: string;
}

const EditProduct = ({ onClose }: { onClose: () => void }) => {
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
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

  const searchProduct = async () => {
    if (!sku.trim()) return;

    setLoading(true);
    setProduct(null);
    setError(null);
    setSuccess(false);

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

      const foundProduct = data[0];
      setProduct(foundProduct);

      setFormData({
        name: foundProduct.name || "",
        description: foundProduct.description || "",
        brand: foundProduct.brand || "",
        category: foundProduct.category || "",
        price: foundProduct.price?.toString() || "",
        image_url: foundProduct.image_url || "",
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    if (!product) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/product/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: formData.name || undefined,
          description: formData.description || undefined,
          brand: formData.brand || undefined,
          category: formData.category || undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
          image_url: formData.image_url || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error || "Failed to update product. Please try again.",
        );
        return;
      }

      const data = await response.json();
      setSuccess(true);
      setProduct(data.product);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Edit Product
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
          {/* Search Section */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Search for a product by SKU to edit its details.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter product SKU..."
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchProduct()}
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
          </div>

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
          {product && (
            <div className="space-y-4 pt-4 border-t">
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
                  {saving ? "Updating..." : "Update Product"}
                </Button>
                <Button variant="outline" onClick={onClose} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
