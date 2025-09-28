"use client";

import WarehouseLayout from "../_component/WarehouseLayout";
import useWarehouseStore from "@/store/useWarehouse";
import ReusableTable from "../_component/ProductContainer";
import { totalStockColumns } from "../_component/TableColumns";
import Tab from "../_component/TableTab";
import { useWarehouseProducts } from "@/hooks/useProducts";
import AddProduct from "./_component/AddProduct";
import { useState } from "react";

export default function WarehousePage({ params }: { params: { id: string } }) {
  const [addProductPopup, setAddProductPopup] = useState(false);
  const [deleteProductPopup, setDeleteProductPopup] = useState("");
  const [editProductPopup, setEditProductPopup] = useState("");

  const { warehouses } = useWarehouseStore();
  const { data, isLoading, isError } = useWarehouseProducts({
    warehouseID: Number(params.id),
  });

  const warehouseId = Number(params.id);

  const currentWarehouse = warehouses.find(
    (w) => Number(w.warehouse_id) === warehouseId,
  );

  return (
    <>
      {addProductPopup && (
        <AddProduct
          warehouseId={Number(params.id)}
          onClose={() => setAddProductPopup(false)}
        />
      )}
      <WarehouseLayout
        title={currentWarehouse?.warehouse_name ?? "Warehouse"}
        companyTotalStock={currentWarehouse?.total_stock || 0}
        companyTotalProducts={currentWarehouse?.total_products || 0}
        onAddProduct={() => setAddProductPopup(true)}
      >
        <ReusableTable
          data={data ?? []}
          columns={totalStockColumns}
          tabComponent={(table) => (
            <Tab
              table={table}
              categories={Array.from(
                new Set((data ?? []).map((d) => d.category)),
              )}
            />
          )}
        />
      </WarehouseLayout>
    </>
  );
}
