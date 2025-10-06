"use client";

import React from "react";
import AddProduct from "../_popups/add-product";
import { usePopup } from "../_store/usePopup";

const PopupHandler = async ({ children }: { children: React.ReactNode }) => {
  const { activePopup } = usePopup();

  return (
    <>
      {activePopup === "add" && <AddProduct />}
      {children}
    </>
  );
};
