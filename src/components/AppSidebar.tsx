"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Home, Users, Warehouse, Settings, ChartSpline } from "lucide-react";
import { NavUser } from "./NavUser";

export const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Analytics", path: "/admin/analytics", icon: ChartSpline },
  { name: "Warehouses", path: "/admin/warehouse", icon: Warehouse },
  { name: "Staff", path: "/admin/staff", icon: Users },
];

export const cashierItems = [
  { name: "Cashier Dashboard", path: "/cashier", icon: Home },
  { name: "Settings", path: "/cashier/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<string | null>(null);
  const [activePath, setActivePath] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [sessionData, setSessionData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchRole = async () => {
      try {
        const session = await authClient.getSession();
        const userRole = session?.data?.user?.role ?? null;
        setRole(userRole);
        setSessionData(session?.data);

        if (userRole === "admin") setActivePath("/admin/dashboard");
        else if (userRole === "cashier") setActivePath("/cashier");
      } catch (err) {
        console.error("Failed to fetch role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Oracle POS</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-gray-500">Loading menu…</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  const itemsToRender =
    role === "admin" ? adminItems : role === "cashier" ? cashierItems : [];

  const userData = {
    name: sessionData?.user?.name || "Unknown User",
    email: sessionData?.user?.email || "Unknown Email",
    avatar: sessionData?.user?.image || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Oracle POS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsToRender.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={activePath === item.path}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setActivePath(item.path)}
                      className="flex items-center"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
