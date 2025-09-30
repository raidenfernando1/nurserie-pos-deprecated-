"use client";
import React from "react";
import WarehouseLayout from "../_component/WarehouseLayout";
import Tab from "../_component/TableTab";
import { useProducts } from "@/hooks/useProducts";
import { totalStockColumns } from "../_component/TableColumns";
import ReusableTable from "../_component/ProductContainer";
import useWarehouseStore from "@/store/useWarehouse";
import { useState } from "react";
import EditProduct from "../[id]/_component/EditProduct";

const TotalWarehouseLayout = () => {
  const { data } = useProducts();
  const [editProductPopup, setEditProductPopup] = useState<boolean>(false);
  const { warehouseStats } = useWarehouseStore();

  return (
    <>
      {editProductPopup && (
        <EditProduct onClose={() => setEditProductPopup(false)} />
      )}
      <WarehouseLayout
        title="Total Stock"
        companyTotalStock={warehouseStats.company_total_stock}
        companyTotalProducts={warehouseStats.company_total_products}
        showActions={false}
        showAdmin={true}
        onEditProduct={() => setEditProductPopup(true)}
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
};

export default TotalWarehouseLayout;
