"use client";
import React, { useEffect } from "react";
import AddProduct from "../_popup/add-product";
import DeleteProduct from "../_popup/delete-product";
import useProductsPopups from "../_store/products-popups";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, closePopup } = useProductsPopups();

  useEffect(() => {
    console.log(activePopup);
  }, [activePopup]);

  return (
    <>
      {activePopup === "add" && <AddProduct onClose={closePopup} />}
      {activePopup === "delete" && <DeleteProduct onClose={closePopup} />}

      {children}
    </>
  );
};

export default PopupHandler;
