"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import useRole from "@/store/useRole";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";

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
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SidebarTrigger />

          {/* Breadcrumbs */}
          <AppBreadcrumbs />

          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
