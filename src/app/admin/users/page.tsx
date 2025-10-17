"use client";

import LoadingBar from "@/components/loading-page";

import ProtectedRoute from "@/components/protected-route";

import { CreateCashier } from "./_component/create-cashier";
import CashierTable from "./_component/table";

function Users() {
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

export default Users;
