"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import useRole from "@/store/useRole";

// shadcn sidebar
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
      <SidebarProvider>
        <AppSidebar />
        <main className="flex justify-center">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
