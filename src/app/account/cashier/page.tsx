import React from "react";
import CashierLogin from "./LoginForm";

export default function Cashier() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-32">
      <div className="flex flex-col items-center justify-center gap-32">
        <div>
          <h1 className="text-7xl tracking-tight">nurserie</h1>
          <h2 className="opacity-30 text-center">cashier</h2>
        </div>
        <CashierLogin />
      </div>
    </main>
  );
}
``;
