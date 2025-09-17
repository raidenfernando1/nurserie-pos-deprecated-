"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import useRole from "@/store/useRole";
import Sidebar from "@/components/Navbar";

export default function DashboardLayout({
  params,
  children,
}: {
  params: { role: string };
  children: React.ReactNode;
}) {
  const { role } = useRole();

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
