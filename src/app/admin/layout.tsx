"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-sidebar";
import ProtectedRoute from "@/components/protected-route";
import { useProducts } from "@/hooks/useProducts";
import LoadingBar from "@/components/loading-page";
import useClient from "./consignments/_store/useClient";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: productsLoading } = useProducts();
  const { fetchClients } = useClient();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={200}>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </LoadingBar>
    </ProtectedRoute>
  );
}
