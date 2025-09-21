import React from "react";
import WarehouseContainer from "./_component/WarehouseContainer";
import ProductContainer from "./_component/ProductContainer";

// DEV NOTE -RAIDEN
// PRODUCT CONTAINER 'DIV' WRAPPER AND PRODUCTCONTAINER.TSX -> PRODUCT TABE CONFLICTS BEHAVIOUR CONFUSING :(
// WILL REMOVE NOTE WHEN PROBLEM IS FIXED

export default function Warehouse() {
  return (
    <main className="h-full">
      <div className="h-full flex flex-col gap-6">
        <WarehouseContainer />
        <div className="h-full">
          <ProductContainer />
        </div>
      </div>
    </main>
  );
}
