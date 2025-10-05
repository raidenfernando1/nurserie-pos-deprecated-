"use client";
import React, { useEffect, useState } from "react";
import ReusableTable from "../_component/product-container";
import Tab from "../_component/table-tab";
import AddProduct from "../_component/popups/add-product";
import DeleteWarehouseProduct from "../_component/popups/delete-product-warehouse";
import WarehouseHeader from "../_component/warehouse-header";
import { columns } from "./table-column";

export default function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [popup, setPopup] = useState<"add" | "delete" | undefined>(undefined);
  const [warehouseData, setWarehouseData] = useState<{
    warehouse: { id: number; warehouse_name: string };
    products: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/warehouse/${id}`);
        if (!response.ok) throw new Error("Failed to fetch warehouse data");

        const data = await response.json();
        setWarehouseData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) return <p>Loading warehouse data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const products = warehouseData?.products ?? [];

  return (
    <>
      <AddProduct
        open={popup === "add"}
        onOpenChange={(open) => !open && setPopup(undefined)}
        warehouseId={id}
      />

      <DeleteWarehouseProduct
        open={popup === "delete"}
        onOpenChange={(open) => !open && setPopup(undefined)}
        warehouseId={id}
      />

      <WarehouseHeader
        title={warehouseData?.warehouse?.warehouse_name || ""}
        onAddProduct={() => setPopup("add")}
        onDeleteProduct={() => setPopup("delete")}
        companyTotalStock={products.reduce((sum, p) => sum + (p.stock || 0), 0)}
        companyTotalProducts={products.length}
      />

      <ReusableTable
        data={products}
        columns={columns}
        tabComponent={(table) => (
          <Tab
            table={table}
            categories={Array.from(new Set(products.map((d) => d.category)))}
          />
        )}
      />
    </>
  );
}
