"use client";
import React, { useEffect } from "react";
import AddProduct from "../_popup/add-product";
import DeleteProduct from "../_popup/delete-product";
import useProductsPopups from "../_store/products-popups";
import EditProduct from "../_popup/edit-product";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, closePopup } = useProductsPopups();

  return (
    <>
      {activePopup === "add" && <AddProduct onClose={closePopup} />}
      {activePopup === "delete" && <DeleteProduct onClose={closePopup} />}
      {activePopup === "edit" && <EditProduct onClose={closePopup} />}

      {children}
    </>
  );
};

export default PopupHandler;
