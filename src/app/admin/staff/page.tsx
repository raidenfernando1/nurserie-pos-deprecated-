"use client";

import { useState } from "react";
import CreateCashier from "./_component/CreateCashier";
import LoadingBar from "@/components/LoadingPage";
import CashierContainer from "./_component/CashierContainer";
import ProtectedRoute from "@/components/ProtectedRoute";

const Staff = () => {
  const [cashierID, setCashierID] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const response = await fetch("/api/admin/cashier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "changePassword",
          cashierID,
          newPassword,
        }),
      });

      const data = await response.json();
    } catch (error) {
      console.error("Error calling changePassword:", error);
    }
  };

  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1000}>
        <div>
          <CreateCashier />
          <CashierContainer />

          <div>
            <input
              type="text"
              placeholder="Cashier ID"
              value={cashierID}
              onChange={(e) => setCashierID(e.target.value)}
            />
            <input
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        </div>
      </LoadingBar>
    </ProtectedRoute>
  );
};

export default Staff;
