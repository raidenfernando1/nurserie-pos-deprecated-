"use client";

import React from "react";
import {
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Listener from "./Listener";
import { authClient } from "@/lib/auth-client";

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
        <div className="flex border-none">
          <AppSidebar />

          <div className="flex border-2 bg-[var(--sidebar)]">
            <SidebarTrigger />
          </div>
        </div>

        <main className="flex flex-1 flex-col gap-4 p-8">{children}</main>
      </SidebarProvider>
    </Listener>
  );
}
