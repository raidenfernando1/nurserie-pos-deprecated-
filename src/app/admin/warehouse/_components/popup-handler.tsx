"use client";

import React, { useEffect } from "react";
import TestPopup from "../_popups/test-popup";
import useProductsPopups from "../../products/_store/products-popups";

const PopupHandler = ({ children }: { children: React.ReactNode }) => {
  const { activePopup } = useProductsPopups();

  useEffect(() => {
    console.log(activePopup);
  }, [activePopup]);

  useEffect(() => {
    console.log(activePopup);
  }, []);
  return (
    <>
      {activePopup === "add-warehouse" && <TestPopup />}
      {children}
    </>
  );
};

export default PopupHandler;
