"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute intendedRole="admin">
      <SidebarProvider>
        <div className="flex border-none">
          <AppSidebar />
          <SidebarTrigger className="m-2" />
        </div>

        <main className="flex flex-1 flex-col gap-4">{children}</main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
