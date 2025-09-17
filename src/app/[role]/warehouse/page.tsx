import React from "react";
import WarehouseContainer from "./_component/WarehouseContainer";
import ProductContainer from "./_component/ProductContainer";

export default function Warehouse() {
  return (
    <main className="flex flex-col gap-6">
      <WarehouseContainer />
      <ProductContainer />
    </main>
  );
}
