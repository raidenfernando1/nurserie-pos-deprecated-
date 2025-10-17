"use client";

import React from "react";
import AddProduct from "@/app/admin/products/_popup/add-product";
import DeleteProduct from "@/app/admin/products/_popup/delete-product";
import EditProduct from "@/app/admin/products/_popup/edit-product";
import { usePopupStore } from "@/store/popup-store";
import AddProductWarehouse from "@/app/admin/warehouse/[id]/_popups/add-product";
import CreateCustomer from "@/components/popup/create-customer";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup } = usePopupStore();

  return (
    <>
      {activePopup === "add-product" && <AddProduct />}
      {activePopup === "delete-product" && <DeleteProduct />}
      {activePopup === "edit-product" && <EditProduct />}
      {activePopup === "add-product-warehouse" && <AddProductWarehouse />}
      {activePopup === "create-customer" && <CreateCustomer />}

      {children}
    </>
  );
};

export default PopupHandler;
