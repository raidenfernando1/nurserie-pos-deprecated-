"use client";

import LoadingBar from "@/components/loading-page";
import CashierTable from "./_component/table";
import { CreateCashier } from "./_component/create-cashier";
import ProtectedRoute from "@/components/protected-route";
import { useProductStore } from "@/store/product-store";

function Staff() {
  const { deleteProduct } = useProductStore();

  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1500}>
        <div className="container mx-auto p-4 space-y-4">
          <CreateCashier />
          <CashierTable />
        </div>
      </LoadingBar>
    </ProtectedRoute>
  );
}

export default Staff;
