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
import { Product } from "@/types/product";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, data } = usePopupStore();

  const assignedSkus = [
    "SKU-1001",
    "SKU-1002",
    "SKU-1003",
    "SKU-1004",
    "SKU-1005",
    "SKU-1006",
    "SKU-1007",
    "SKU-1008",
    "SKU-1009",
    "SKU-1010",
  ];

  return (
    <>
      {activePopup === "add-product" && <AddProductPopup />}
      {activePopup === "delete-product" && <DeleteProductPopup />}
      {activePopup === "edit-product" && <EditProductPopup />}
      {activePopup === "add-product-warehouse" && <AddProductWarehouse />}
      {/* cashier create cutomer missing */}
      {activePopup === "move-product-warehouse" && <MoveProductWarehouse />}
      {activePopup === "add-warehouse" && <AddWarehousePopup />}
      {activePopup === "change-user-password" && (
        <ChangePasswordPopup data={data} />
      )}
      {activePopup === "admin-create-cashier" && <CreateCashierPopup />}
      {activePopup === "product-data-view" && <ProductDetailPopup />}

      {children}
    </>
  );
};

export default PopupHandler;
