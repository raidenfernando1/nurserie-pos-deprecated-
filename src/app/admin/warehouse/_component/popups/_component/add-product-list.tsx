import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useProducts(false);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.warehouse_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <CardContent className="space-y-4">
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
        {filteredProducts.map((data) => (
          <div
            key={data.id}
            className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
          >
            <p className="font-medium text-sm">{data.name}</p>
            <p className="text-xs text-muted-foreground">
              {data.category} • {data.sku}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  );
};

export default ProductList;
