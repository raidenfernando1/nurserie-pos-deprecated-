"use client";
import React from "react";
import WarehouseLayout from "../_component/warehouse-layout";
import Tab from "../_component/table-tab";
import { useProducts } from "@/hooks/useProducts";
import { totalStockColumns } from "../_component/table-column";
import ReusableTable from "../_component/product-container";
import useWarehouseStore from "@/store/useWarehouse";
import { useState } from "react";
import EditProduct from "../_component/popups/edit-product";
import DeleteProduct from "../_component/popups/delete-product";

const TotalWarehouseLayout = () => {
  const { data } = useProducts();
  const [editProductPopup, setEditProductPopup] = useState<boolean>(false);
  const [deleteProductPopup, setDeleteProductPopup] = useState<boolean>(false);
  const { warehouseStats } = useWarehouseStore();

  return (
    <>
      {editProductPopup && (
        <EditProduct onClose={() => setEditProductPopup(false)} />
      )}
      {deleteProductPopup && (
        <DeleteProduct onClose={() => setDeleteProductPopup(false)} />
      )}
      <WarehouseLayout
        title="Total Stock"
        companyTotalStock={warehouseStats.company_total_stock}
        companyTotalProducts={warehouseStats.company_total_products}
        showActions={false}
        showAdmin={true}
        onDeleteProduct={() => setDeleteProductPopup(true)}
        onEditProduct={() => setEditProductPopup(true)}
      >
        <ReusableTable
          data={data ?? []}
          columns={totalStockColumns}
          tabComponent={(table) => (
            <Tab
              table={table}
              categories={Array.from(
                new Set((data ?? []).map((d) => d.category))
              )}
            />
          )}
        />
      </WarehouseLayout>
    </>
  );
};

export default TotalWarehouseLayout;
