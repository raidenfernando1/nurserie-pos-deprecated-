"use client";
import React from "react";
import WarehouseLayout from "./_component/warehouse-layout";
import Tab from "./_component/table-tab";
import { useProducts } from "@/hooks/useProducts";
import { totalStockColumns } from "./_component/table-column";
import ReusableTable from "./_component/product-container";
import useWarehouseStore from "@/store/useWarehouse";
import { useState } from "react";
import EditProduct from "./_component/popups/edit-product";
import MoveProduct from "./_component/popups/move-product";
import DeleteProduct from "./_component/popups/delete-product";
import AddExistingProduct from "./_component/popups/add-exiting-product";

const TotalWarehouseLayout = () => {
  const { data } = useProducts();
  const [editProductPopup, setEditProductPopup] = useState<boolean>(false);
  const [deleteProductPopup, setDeleteProductPopup] = useState<boolean>(false);
  const [moveProductPopup, setMoveProductPopup] = useState<boolean>(false);
  const [isAddExistingProductOpen, setIsAddExistingProductOpen] =
    useState<boolean>(false);
  const { warehouseStats } = useWarehouseStore();

  return (
    <>
      {editProductPopup && (
        <EditProduct onClose={() => setEditProductPopup(false)} />
      )}
      {deleteProductPopup && (
        <DeleteProduct onClose={() => setDeleteProductPopup(false)} />
      )}
      {moveProductPopup && <MoveProduct />}
      {isAddExistingProductOpen && <AddExistingProduct />}
      <WarehouseLayout
        title="Total Stock"
        companyTotalStock={warehouseStats.company_total_stock}
        companyTotalProducts={warehouseStats.company_total_products}
        showActions={false}
        showAdmin={true}
        onDeleteProduct={() => setDeleteProductPopup(true)}
        onEditProduct={() => setEditProductPopup(true)}
        onMoveProduct={() => setMoveProductPopup(true)}
        onAddExistingProduct={() => setIsAddExistingProductOpen(true)}
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
