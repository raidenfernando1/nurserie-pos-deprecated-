import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";
import PopupHandler from "@/components/popup/popup-handler";
import AdminSidebarWrapper from "@/components/sidebar/admin-sidebar-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute intendedRole="admin">
      <SidebarProvider>
        <AdminSidebarWrapper />
        <PopupHandler>
          <div className="flex h-screen w-full overflow-hidden">
            <main className="flex flex-1 flex-col overflow-auto">
              {children}
            </main>
          </div>
        </PopupHandler>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
