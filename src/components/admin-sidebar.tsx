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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Warehouse,
  Settings,
  ChartSpline,
  ChevronDown,
} from "lucide-react";
import { NavUser } from "./navbar-user";
import useWarehouseStore from "@/store/useWarehouse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Analytics", path: "/admin/analytics", icon: ChartSpline },
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
  const { warehouses } = useWarehouseStore();

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

              {/* Warehouses Dropdown - Only for Admin */}
              {role === "admin" && (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Warehouse className="mr-2 h-4 w-4" />
                        <span>Warehouses</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {/* View All Stocks Option */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={activePath === "/admin/warehouse/total"}
                          >
                            <Link
                              href="/admin/warehouse/total"
                              onClick={() =>
                                setActivePath("/admin/warehouse/total")
                              }
                            >
                              <span>All Stocks</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Individual Warehouses */}
                        {warehouses && warehouses.length > 0 ? (
                          warehouses.map((warehouse: any) => (
                            <SidebarMenuSubItem key={warehouse.warehouse_id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={
                                  activePath ===
                                  `/admin/warehouse/${warehouse.warehouse_id}`
                                }
                              >
                                <Link
                                  href={`/admin/warehouse/${warehouse.warehouse_id}`}
                                  onClick={() =>
                                    setActivePath(
                                      `/admin/warehouse/${warehouse.warehouse_id}`
                                    )
                                  }
                                >
                                  <span>{warehouse.warehouse_name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        ) : (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <span className="text-gray-500">
                                No warehouses
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
