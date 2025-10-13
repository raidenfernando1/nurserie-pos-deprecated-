"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  ChartSpline,
  ChevronDown,
  Handshake,
  Package,
} from "lucide-react";
import { NavUser } from "../navbar-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useClient from "@/app/admin/consignments/_store/useClient";
import { useSession } from "@/utils/getSession";
import { fetcher } from "@/utils/swrFetcher";

export const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Analytics", path: "/admin/analytics", icon: ChartSpline },
  { name: "Staff", path: "/admin/staff", icon: Users },
  { name: "Products", path: "/admin/products", icon: Package },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubPath, setActiveSubPath] = useState("/admin/dashboard");
  const [warehouses, setWarehouses] = useState<any>(null);
  const { clients } = useClient();
  const { loading } = useSession();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await fetcher("/api/admin/warehouse");
        setWarehouses(data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        setWarehouses("Error fetching data");
      }
    };

    fetchWarehouses();
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Oracle POS</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-sm ">Loading menu…</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarTrigger className="m-2" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Oracle POS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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

              {/* Warehouses */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={activeMenu === "warehouse"}>
                      <Warehouse className="mr-2 h-4 w-4" />
                      <span>Warehouses</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* All Stocks */}
                      <SidebarMenuSubButton
                        asChild
                        isActive={activeSubPath === "/admin/stock"}
                      >
                        <Link
                          className="border-2"
                          href="/admin/stock"
                          onClick={() => {
                            setActiveMenu("stock");
                            setActiveSubPath("/admin/stock");
                          }}
                        >
                          <span>All Stocks</span>
                        </Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton
                        asChild
                        isActive={activeSubPath === "/admin/warehouse"}
                      >
                        <Link
                          className="border-2"
                          href="/admin/warehouse"
                          onClick={() => {
                            setActiveMenu("warehouse");
                            setActiveSubPath("/admin/warehouse");
                          }}
                        >
                          <span>All Warehouses</span>
                        </Link>
                      </SidebarMenuSubButton>
                      {/* Individual Warehouses */}
                      {warehouses?.response &&
                      warehouses.response.length > 0 ? (
                        warehouses.response.map((warehouse: any) => (
                          <SidebarMenuSubItem key={warehouse.warehouse_id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={
                                activeSubPath ===
                                `/admin/warehouse/${warehouse.warehouse_id}`
                              }
                            >
                              <Link
                                href={`/admin/warehouse/${warehouse.warehouse_id}`}
                                onClick={() => {
                                  setActiveMenu("warehouse");
                                  setActiveSubPath(
                                    `/admin/warehouse/${warehouse.warehouse_id}`,
                                  );
                                }}
                              >
                                <span>
                                  {warehouse.warehouse_name ||
                                    "Unnamed Warehouse"}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span>No warehouses</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Consignments */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={activeMenu === "consignments"}>
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
                          className="border-2"
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
                            <span>No clients</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
