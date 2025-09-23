"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface Product {
  product_id: number;
  product_name: string;
  brand?: string;
  description?: string;
  barcode?: number;
  img_url?: string;
  product_sku: string;
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
      <DataTable columns={columns} data={products} /> {/* fixed */}
    </div>
  );
}
