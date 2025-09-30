"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import WarehouseHeader from "../_component/WarehouseHeader";

interface WarehouseLayoutProps {
  children: React.ReactNode;
  title?: string;
  showActions?: boolean;
  showAdmin?: boolean;
  companyTotalStock?: number;
  companyTotalProducts?: number;
  onEditProduct?: () => void;
  onDeleteProduct?: () => void;
  onAddProduct?: () => void;
}

const WarehouseLayout: React.FC<WarehouseLayoutProps> = ({
  children,
  title = "Warehouse",
  showActions = true,
  showAdmin = false,
  companyTotalStock,
  companyTotalProducts,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
}) => {
  return (
    <main className="h-screen flex flex-col p-2">
      <WarehouseHeader
        title={title}
        showActions={showActions}
        showAdmin={showAdmin}
        companyTotalStock={companyTotalStock || 0}
        companyTotalProducts={companyTotalProducts || 0}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onAddProduct={onAddProduct}
      />
      <Separator decorative={false} className="my-3" />
      <div className="flex-1 min-h-0">{children}</div>
    </main>
  );
};

export default WarehouseLayout;
