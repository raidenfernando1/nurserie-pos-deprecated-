"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Package, Search, Loader2 } from "lucide-react";
import { createWarehouseProduct } from "@/hooks/useProducts";

type FormFields = {
  sku: string;
  barcode: string;
  name: string;
  price: string;
  category: string;
  brand: string;
  imageUrl: string;
  initialStock: string;
  threshold: string;
  description: string;
};

const initialForm: FormFields = {
  sku: "",
  barcode: "",
  name: "",
  price: "",
  category: "",
  brand: "",
  imageUrl: "",
  initialStock: "",
  threshold: "",
  description: "",
};

// Reusable Card wrapper
const StepCard: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => (
  <Card className="w-full max-w-md">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <CardTitle>{title}</CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const AddProduct = ({
  onClose,
  warehouseId,
}: {
  onClose: () => void;
  warehouseId: string;
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormFields>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange =
    (field: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const resetForm = () => {
    setForm(initialForm);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { sku, name, brand, category, price, initialStock, threshold } =
        form;

      if (
        ![sku, name, brand, category, price, initialStock, threshold].every(
          (v) => v.trim() !== "",
        )
      )
        throw new Error("Please fill in all required fields");

      const parsedPrice = parseFloat(price);
      const parsedInitialStock = parseInt(initialStock);
      const parsedThreshold = parseInt(threshold);

      if (parsedPrice < 0 || isNaN(parsedPrice))
        throw new Error("Invalid price");
      if (parsedInitialStock < 0 || isNaN(parsedInitialStock))
        throw new Error("Invalid initial stock");
      if (parsedThreshold < 0 || isNaN(parsedThreshold))
        throw new Error("Invalid threshold");

      const productData = {
        ...form,
        price: parsedPrice,
        initial_stock: parsedInitialStock,
        stock_threshold: parsedThreshold,
        description: form.description.trim() || undefined,
        barcode: form.barcode.trim() || undefined,
        image_url: form.imageUrl.trim() || undefined,
      };

      const result = await createWarehouseProduct(productData);

      if (!result || result.error)
        throw new Error(result?.error || "Failed to create product");

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      id: 0,
      title: "Add Product",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to add a product to your inventory.
          </p>
          <div className="grid gap-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="justify-start h-12"
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
              variant="outline"
              className="justify-start h-12"
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
        </div>
      ),
    },
    {
      id: 1,
      title: "New Product",
      content: (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "SKU *", field: "sku" },
                { label: "Barcode", field: "barcode" },
                { label: "Product Name *", field: "name" },
              ].map(({ label, field }) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    value={form[field as keyof FormFields]}
                    onChange={handleChange(field as keyof FormFields)}
                    required={label.includes("*")}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Price *", field: "price", type: "number" },
                { label: "Category *", field: "category" },
                { label: "Brand *", field: "brand" },
                { label: "Image URL", field: "imageUrl" },
              ].map(({ label, field, type }) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    type={type || "text"}
                    value={form[field as keyof FormFields]}
                    onChange={handleChange(field as keyof FormFields)}
                    required={label.includes("*")}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={handleChange("description")}
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Initial Stock *",
                  field: "initialStock",
                  type: "number",
                },
                {
                  label: "Low Stock Threshold *",
                  field: "threshold",
                  type: "number",
                },
              ].map(({ label, field, type }) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    type={type}
                    value={form[field as keyof FormFields]}
                    onChange={handleChange(field as keyof FormFields)}
                    required
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>

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
              className="flex-1"
              onClick={resetForm}
              disabled={isLoading}
            >
              Reset Form
            </Button>
          </div>
        </form>
      ),
    },
    {
      id: 2,
      title: "Product Created!",
      content: (
        <div className="text-center space-y-4">
          <Badge variant="secondary">Success</Badge>
          <p>Product added successfully to inventory.</p>
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setStep(1);
              }}
              className="flex-1"
              variant="outline"
            >
              Add Another
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps.find((s) => s.id === step);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {currentStep && (
        <StepCard title={currentStep.title} onClose={onClose}>
          {currentStep.content}
        </StepCard>
      )}
    </div>
  );
};

export default AddProduct;
