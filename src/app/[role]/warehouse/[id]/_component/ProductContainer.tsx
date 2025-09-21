"use client";

import React from "react";

interface Product {
  product_id: number;
  product_name: string;
  product_variants_id?: number;
  variant_name?: string;
  total_stock_in_warehouse?: number;
  brand?: string;
  description?: string;
  barcode?: number;
  stock_threshold?: number;
  img_url?: string;
}

interface ProductContainerProps {
  warehouseID: number;
}

export default function ProductContainer({
  warehouseID,
}: ProductContainerProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `/api/admin/warehouse/${warehouseID}/products`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Server error:", response.status);
          setLoading(false);
          return;
        }

        const data: Product[] = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, [warehouseID]);

  if (loading) return <p>Loading products...</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div>
      {products.map((p) => (
        <div key={p.product_id} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>Product:</strong> {p.product_name}
          </p>
          <p>
            <strong>Brand:</strong> {p.brand}
          </p>
          <p>
            <strong>Description:</strong> {p.description}
          </p>
          <p>
            <strong>Barcode:</strong> {p.barcode}
          </p>
          <p>
            <strong>Stock Threshold:</strong> {p.stock_threshold}
          </p>
          <p>
            <strong>Total Stock:</strong> {p.total_stock_in_warehouse}
          </p>
          <img src={p.img_url} />
        </div>
      ))}
    </div>
  );
}
