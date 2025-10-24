"use client";
import React from "react";
import { usePopupStore } from "@/store/popup-store";
import AddProductWarehouse from "@/app/admin/warehouse/[id]/_popups/add-product";
import CreateCashierPopup from "@/app/admin/users/_popup/create-cashier";
import MoveProductWarehouse from "@/app/admin/warehouse/[id]/_popups/move-product";
import AddWarehousePopup from "@/app/admin/warehouse/_popups/add-warehouse";
import AddProductPopup from "@/app/admin/products/_popup/add-product";
import DeleteProductPopup from "@/app/admin/products/_popup/delete-product";
import EditProductPopup from "@/app/admin/products/_popup/edit-product";
import ChangePasswordPopup from "@/app/admin/users/_popup/change-password";
import ProductDetailPopup from "@/app/admin/products/_popup/product-card";
import CreateCustomerPopup from "./create-costumer";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, data } = usePopupStore();

  return (
    <>
      {activePopup === "add-product" && <AddProductPopup />}
      {activePopup === "delete-product" && <DeleteProductPopup />}
      {activePopup === "edit-product" && <EditProductPopup />}
      {activePopup === "add-product-warehouse" && <AddProductWarehouse />}
      {activePopup === "move-product-warehouse" && <MoveProductWarehouse />}
      {activePopup === "add-warehouse" && <AddWarehousePopup />}
      {activePopup === "change-user-password" && (
        <ChangePasswordPopup data={data} />
      )}
      {activePopup === "admin-create-cashier" && <CreateCashierPopup />}
      {activePopup === "product-data-view" && <ProductDetailPopup />}
      {activePopup === "create-customer-popup" && <CreateCustomerPopup />}

      {children}
    </>
  );
};

export default PopupHandler;
