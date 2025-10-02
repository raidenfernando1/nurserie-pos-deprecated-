"use client";

import { useState } from "react";

import useWarehouseStore from "@/store/useWarehouse";
import { useWarehouseProducts } from "@/hooks/useProducts";

import WarehouseLayout from "../_component/warehouse-layout";
import ReusableTable from "../_component/product-container";
import Tab from "../_component/table-tab";
import AddProduct from "../_component/popups/add-product";
import DeleteWarehouseProduct from "../_component/popups/delete-product-warehouse";
import LoadingBar from "@/components/loading-page";

import { columns } from "./table-column";

export default function WarehousePage({ params }: { params: { id: string } }) {
  const [addProductPopup, setAddProductPopup] = useState<boolean>(false);
  const [deleteWarehouseProduct, setDeleteWarehouseProduct] =
    useState<boolean>(false);

  const { warehouses } = useWarehouseStore();
  const { data, isLoading, isError } = useWarehouseProducts({
    warehouseID: Number(params.id),
  });

  const warehouseId = Number(params.id);

  const currentWarehouse = warehouses.find(
    (w) => Number(w.warehouse_id) === warehouseId,
  );

  return (
    <LoadingBar duration={500}>
      {addProductPopup && (
        <AddProduct
          warehouseId={Number(params.id)}
          onClose={() => setAddProductPopup(false)}
        />
      )}
      {deleteWarehouseProduct && (
        <DeleteWarehouseProduct
          warehouseId={Number(params.id)}
          onClose={() => setDeleteWarehouseProduct(false)}
        />
      )}
      <WarehouseLayout
        title={currentWarehouse?.warehouse_name ?? "Warehouse"}
        companyTotalStock={currentWarehouse?.total_stock || 0}
        companyTotalProducts={currentWarehouse?.total_products || 0}
        onAddProduct={() => setAddProductPopup(true)}
        onDeleteWarehouseProduct={() => setDeleteWarehouseProduct(true)}
      >
        <ReusableTable
          data={data ?? []}
          columns={columns}
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
    </LoadingBar>
  );
}
