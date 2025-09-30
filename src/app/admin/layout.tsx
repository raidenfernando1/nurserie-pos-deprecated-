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
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <main className="flex flex-1 flex-col overflow-auto">
            <div className="sticky top-0 z-10 bg-background">
              <SidebarTrigger className="m-2" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
