"use client";

import React from "react";
import WarehouseContainer from "./_component/WarehouseContainer";
import ProductContainer from "./_component/ProductContainer";
import LoadingBar from "@/components/LoadingPage";

export default function Warehouse() {
  return (
    <LoadingBar duration={1000}>
      <main className="h-full">
        <div className="h-full flex flex-col gap-6">
          <WarehouseContainer />
          <div className="h-full">
            <ProductContainer />
          </div>
        </div>
      </main>
    </LoadingBar>
  );
}
