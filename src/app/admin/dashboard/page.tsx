"use client";

import React from "react";
import DashboardCard from "@/components/DashboardCard";
import LoadingBar from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const adminItems = [
  { name: "Warehouse", path: "/admin/warehouse" },
  { name: "Analytics", path: "/admin/analytics" },
  { name: "Staff", path: "/admin/staff" },
];

export default function AdminView() {
  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1000}>
        <main className="grid grid-cols-3 gap-3">
          {adminItems.map((data) => (
            <DashboardCard key={data.path} title={data.name} path={data.path} />
          ))}
        </main>
      </LoadingBar>
    </ProtectedRoute>
  );
}
