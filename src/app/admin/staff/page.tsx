"use client";

import { useState } from "react";
import CreateCashier from "./_component/CreateCashier";
import LoadingBar from "@/components/LoadingPage";
import CashierContainer from "./_component/CashierContainer";

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
      console.log("Response from API:", data);
    } catch (error) {
      console.error("Error calling changePassword:", error);
    }
  };

  return (
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
  );
};

export default Staff;
