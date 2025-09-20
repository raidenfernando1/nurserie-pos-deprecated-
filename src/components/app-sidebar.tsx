"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

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

import {
  Home,
  Users,
  Warehouse,
  Settings,
  ChartSpline,
  Loader2Icon,
} from "lucide-react";

// Define role-based menus
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

export function AppSidebar() {
  const [role, setRole] = React.useState<string | null>(null);
  const [activePath, setActivePath] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    const fetchRole = async () => {
      try {
        const session = await authClient.getSession();
        const userRole = session?.data?.user?.role ?? null;
        setRole(userRole);

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

  if (loading || !role) {
    return null; // prevent flashing
  }

  const itemsToRender =
    role === "admin" ? adminItems : role === "cashier" ? cashierItems : [];

  return (
    <Sidebar>
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
        <Button
          disabled={signingOut}
          variant="destructive"
          className="w-full rounded-[0.3rem]"
          onClick={async () => {
            try {
              setSigningOut(true);
              await authClient.signOut();
              window.location.href = "/";
            } catch (err) {
              console.error("Sign out failed:", err);
            } finally {
              setSigningOut(false);
            }
          }}
        >
          {signingOut ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Signing Out...
            </>
          ) : (
            "Sign Out"
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
