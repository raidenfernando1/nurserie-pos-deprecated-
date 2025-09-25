import React from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import useRole from "@/store/useRole";
import Listener from "./Listener";
import { Metadata } from "next";

export default function DashboardLayout({
  params,
  children,
}: {
  params: { role: string };
  children: React.ReactNode;
}) {
  return (
    <Listener>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-8">{children}</main>
      </SidebarProvider>
    </Listener>
  );
}
