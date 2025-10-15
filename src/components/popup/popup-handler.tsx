"use client";

import React from "react";
import AddProduct from "@/app/admin/products/_popup/add-product";
import DeleteProduct from "@/app/admin/products/_popup/delete-product";
import EditProduct from "@/app/admin/products/_popup/edit-product";
import { usePopupStore } from "@/store/popup-store";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, closePopup } = usePopupStore();

  return (
    <>
      {activePopup === "add-product" && <AddProduct onClose={closePopup} />}
      {activePopup === "delete-product" && (
        <DeleteProduct onClose={closePopup} />
      )}
      {activePopup === "edit-product" && <EditProduct onClose={closePopup} />}

      {children}
    </>
  );
};

export default PopupHandler;
