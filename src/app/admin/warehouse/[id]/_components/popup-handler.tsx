"use client";

import React from "react";
import AddProduct from "../_popups/add-product-temp";
import { usePopup } from "../_store/usePopup";

const PopupHandler = ({
  children,
  warehouseID,
}: {
  warehouseID: string;
  children: React.ReactNode;
}) => {
  const { activePopup, closePopup } = usePopup();

  return (
    <>
      {activePopup === "add-product" && (
        <AddProduct warehouseID={warehouseID} onClose={closePopup} />
      )}

      {children}
    </>
  );
};

export default PopupHandler;
