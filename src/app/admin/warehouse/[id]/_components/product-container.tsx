import { useProductStore } from "@/store/product-store";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

const ProductContainer = () => {
  const { fetchAllProducts } = useProductStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const products = await fetchAllProducts();
      setProducts(products);
    })();
  }, [fetchAllProducts]);

  if (!products.length) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <strong>{product.name}</strong> — {product.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductContainer;
