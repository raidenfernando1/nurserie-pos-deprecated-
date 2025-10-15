"use client";

import React from "react";
import AddProduct from "@/app/admin/products/_popup/add-product";
import DeleteProduct from "@/app/admin/products/_popup/delete-product";
import EditProduct from "@/app/admin/products/_popup/edit-product";
import { usePopupStore } from "@/store/popup-store";
import AddProductWarehouse from "@/app/admin/warehouse/[id]/_popups/add-product";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, closePopup } = usePopupStore();

  return (
    <>
      {activePopup === "add-product" && <AddProduct />}
      {activePopup === "delete-product" && <DeleteProduct />}
      {activePopup === "edit-product" && <EditProduct />}
      {activePopup === "add-product-warehouse" && <AddProductWarehouse />}

      {children}
    </>
  );
};

export default PopupHandler;
