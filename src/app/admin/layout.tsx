"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-sidebar";
import ProtectedRoute from "@/components/protected-route";
import { useProducts } from "@/hooks/useProducts";
import { useWarehouses } from "@/hooks/useWarehouse";
import LoadingBar from "@/components/loading-page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: productsLoading } = useProducts();
  const { isLoading: warehousesLoading } = useWarehouses();

  const isLoading = productsLoading || warehousesLoading;

  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1500}>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar />
            <main className="flex flex-1 flex-col overflow-auto">
              <div className="sticky top-0 z-10 bg-background">
                <SidebarTrigger className="m-2" />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">
                      Loading dashboard data...
                    </div>
                  </div>
                ) : (
                  children
                )}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </LoadingBar>
    </ProtectedRoute>
  );
}
