"use client";
import React from "react";
import { usePopup } from "../_store/usePopup";
import AddWarehouse from "../_popups/add-warehouse";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup, closePopup } = usePopup();

  return (
    <>
      {activePopup === "make-warehouse" && (
        <AddWarehouse onClose={closePopup} />
      )}

      {children}
    </>
  );
};

export default PopupHandler;
