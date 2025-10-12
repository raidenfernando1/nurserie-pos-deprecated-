"use client";

import { useEffect, useState } from "react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Warehouse,
  Settings,
  ChartSpline,
  ChevronDown,
  Handshake,
  Package,
} from "lucide-react";
import { NavUser } from "./navbar-user";
import useWarehouseStore from "@/store/useWarehouse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useClient from "@/app/admin/consignments/_store/useClient";

export const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Analytics", path: "/admin/analytics", icon: ChartSpline },
  { name: "Staff", path: "/admin/staff", icon: Users },
  { name: "Products", path: "/admin/products", icon: Package },
];

export const cashierItems = [
  { name: "Cashier Dashboard", path: "/cashier", icon: Home },
  { name: "Settings", path: "/cashier/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubPath, setActiveSubPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const { clients } = useClient();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const session = await authClient.getSession();
        const userRole = session?.data?.user?.role ?? null;
        setRole(userRole);
        setSessionData(session?.data);
        if (userRole === "admin") setActiveSubPath("/admin/dashboard");
        else if (userRole === "cashier") setActiveSubPath("/cashier");
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
      <SidebarTrigger className="m-2" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Oracle POS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsToRender.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSubPath === item.path}
                  >
                    <Link
                      href={item.path}
                      onClick={() => {
                        setActiveMenu("");
                        setActiveSubPath(item.path);
                      }}
                      className="flex items-center"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {role === "admin" && (
                <>
                  {/* Warehouses */}
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeMenu === "warehouse"}
                        >
                          <Warehouse className="mr-2 h-4 w-4" />
                          <span>Warehouses</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubButton
                            asChild
                            isActive={activeSubPath === "/admin/warehouse"}
                          >
                            <Link
                              href="/admin/warehouse"
                              onClick={() => {
                                setActiveMenu("warehouse");
                                setActiveSubPath("/admin/warehouse");
                              }}
                            >
                              <span>All Stocks</span>
                            </Link>
                          </SidebarMenuSubButton>

                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <span className="text-gray-500">
                                No warehouses
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Consignments */}
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeMenu === "consignments"}
                        >
                          <Handshake className="mr-2 h-4 w-4" />
                          <span>Consignments</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* All Clients */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={activeSubPath === "/admin/consignments"}
                            >
                              <Link
                                href="/admin/consignments"
                                onClick={() => {
                                  setActiveMenu("consignments");
                                  setActiveSubPath("/admin/consignments");
                                }}
                              >
                                <span>All Clients</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          {/* Individual Clients */}
                          {clients && clients.length > 0 ? (
                            clients.map((client: any) => (
                              <SidebarMenuSubItem key={client.client_id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={
                                    activeSubPath ===
                                    `/admin/consignments/${client.client_id}`
                                  }
                                >
                                  <Link
                                    href={`/admin/consignments/${client.client_id}`}
                                    onClick={() => {
                                      setActiveMenu("consignments");
                                      setActiveSubPath(
                                        `/admin/consignments/${client.client_id}`,
                                      );
                                    }}
                                  >
                                    <span>
                                      {client.client_name || "Unnamed Client"}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))
                          ) : (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton>
                                <span className="text-gray-500">
                                  No clients
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </>
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
