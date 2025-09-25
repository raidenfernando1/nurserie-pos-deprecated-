"use client";

import { useState, useEffect } from "react";
import ProductContainer from "./_component/ProductContainer";

export default function WarehousePage({ params }: { params: { id: string } }) {
  const [warehouseName, setWarehouseName] = useState("");
  const { id } = params;

  const fetchWarehouseName = async () => {
    try {
      const response = await fetch(`/api/admin/warehouse/${id}`);
      if (!response.ok) {
        console.error("Failed to fetch warehouse:", response.statusText);
        return;
      }

      const data = await response.json();
      setWarehouseName(data.warehouse_name || "hit");
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    }
  };

  useEffect(() => {
    if (id) fetchWarehouseName();
  }, [id]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Warehouse: {warehouseName}</h1>
      <ProductContainer warehouseID={Number(id)} />
    </div>
  );
}
