"use client";

import React from "react";

import LoadingBar from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHome from "@/components/DashboardHome";

export default function AdminView() {
  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1000}>
        <main>
          <DashboardHome />
        </main>
      </LoadingBar>
    </ProtectedRoute>
  );
}
