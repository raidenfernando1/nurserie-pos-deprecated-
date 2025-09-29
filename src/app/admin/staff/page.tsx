"use client";

import LoadingBar from "@/components/LoadingPage";
import CashierTable from "./_component/CashierTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CreateCashier } from "./_component/CreateCashier";

function Staff() {
  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1000}>
        <div className="container mx-auto p-4 space-y-4">
          <CreateCashier />
          <CashierTable />
        </div>
      </LoadingBar>
    </ProtectedRoute>
  );
}

export default Staff;
