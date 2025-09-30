"use client";
import React from "react";
import WarehouseLayout from "../_component/WarehouseLayout";
import Tab from "../_component/TableTab";
import { useProducts } from "@/hooks/useProducts";
import { totalStockColumns } from "../_component/TableColumns";
import ReusableTable from "../_component/ProductContainer";
import useWarehouseStore from "@/store/useWarehouse";

const TotalWarehouseLayout = () => {
  const { data } = useProducts();
  const { warehouseStats } = useWarehouseStore();

  return (
    <WarehouseLayout
      title="Total Stock"
      companyTotalStock={warehouseStats.company_total_stock}
      companyTotalProducts={warehouseStats.company_total_products}
      showActions={false}
    >
      <ReusableTable
        data={data ?? []}
        columns={totalStockColumns}
        tabComponent={(table) => (
          <Tab
            table={table}
            categories={Array.from(
              new Set((data ?? []).map((d) => d.category)),
            )}
          />
        )}
      />
    </WarehouseLayout>
  );
};

export default TotalWarehouseLayout;
