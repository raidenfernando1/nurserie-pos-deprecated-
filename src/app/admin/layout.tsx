"use client";

import React, { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";
import LoadingBar from "@/components/loading-page";
import useClient from "./consignments/_store/useClient";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import PopupHandler from "@/components/popup/popup-handler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchClients } = useClient();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <ProtectedRoute intendedRole="admin">
      <SidebarProvider>
        <PopupHandler>
          <div className="flex h-screen w-full overflow-hidden">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-auto">
              {children}
            </main>
          </div>
        </PopupHandler>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
