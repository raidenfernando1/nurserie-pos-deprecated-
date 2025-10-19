"use client";

import React from "react";
import EditProduct from "@/app/admin/products/_popup/edit-product";
import { usePopupStore } from "@/store/popup-store";
import AddProductWarehouse from "@/app/admin/warehouse/[id]/_popups/add-product";
import CreateCustomer from "@/components/popup/create-customer";
import MoveProductWarehouse from "@/app/admin/warehouse/[id]/_popups/move-product";
import AddWarehousePopup from "@/app/admin/warehouse/_popups/add-warehouse";
import AddProductPopup from "@/app/admin/products/_popup/add-product";
import DeleteProductPopup from "@/app/admin/products/_popup/delete-product";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup } = usePopupStore();

  return (
    <>
      {activePopup === "add-product" && <AddProductPopup />}
      {activePopup === "delete-product" && <DeleteProductPopup />}
      {activePopup === "edit-product" && <EditProduct />}
      {activePopup === "add-product-warehouse" && <AddProductWarehouse />}
      {activePopup === "create-customer" && <CreateCustomer />}
      {activePopup === "move-product-warehouse" && <MoveProductWarehouse />}
      {activePopup === "add-warehouse" && <AddWarehousePopup />}

      {children}
    </>
  );
};

export default PopupHandler;
