"use client";

import React from "react";

interface Product {
  product_id: number;
  product_name: string;
  brand?: string;
  description?: string;
  barcode?: number;
  img_url?: string;
  variant_id?: number;
  variant_name?: string;
  variant_stock?: number;
  variant_stock_threshold?: number;
  variant_price?: number;
  variant_sku?: string;
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
          },
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
        <div
          key={`${p.product_id}-${p.variant_id}`}
          style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc" }}
        >
          <h3>{p.product_name}</h3>
          <p>
            <strong>Brand:</strong> {p.brand}
          </p>
          <p>
            <strong>Barcode:</strong> {p.barcode}
          </p>
          {p.img_url && (
            <img
              src={p.img_url}
              alt={p.product_name}
              style={{
                maxWidth: "150px",
                display: "block",
                margin: "0.5rem 0",
              }}
            />
          )}

          {p.variant_id && (
            <div style={{ marginLeft: "1rem" }}>
              <p>
                <strong>Variant:</strong> {p.variant_name}
              </p>
              <p>
                <strong>Stock:</strong> {p.variant_stock}
              </p>
              <p>
                <strong>Threshold:</strong> {p.variant_stock_threshold}
              </p>
              <p>
                <strong>Price:</strong> {p.variant_price}
              </p>
              <p>
                <strong>SKU:</strong> {p.variant_sku}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
