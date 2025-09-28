"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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

          <div className="flex border-2 bg-[var(--sidebar)]">
            <SidebarTrigger />
          </div>
        </div>

        <main className="flex flex-1 flex-col gap-4">{children}</main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
