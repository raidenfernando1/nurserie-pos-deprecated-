"use client";

import React from "react";
import AddProduc1t from "../_popups/add-product";
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
        <AddProduc1t warehouseID={warehouseID} onClose={closePopup} />
      )}

      {children}
    </>
  );
};

export default PopupHandler;
