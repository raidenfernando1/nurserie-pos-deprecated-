"use client";

import { useState } from "react";
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
  UserSearch,
} from "lucide-react";
import { NavUser } from "../navbar-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "../ui/separator";
import { company } from "../data";

// Define types
interface WarehouseData {
  warehouse_id: number;
  warehouse_name: string;
}

interface ClientData {
  client_id: number;
  client_name: string;
}

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  clients: ClientData[];
  warehouses: WarehouseData[];
}

export const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Analytics", path: "/admin/analytics", icon: ChartSpline },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Customers", path: "/admin/customers", icon: UserSearch },
  { name: "Products", path: "/admin/products", icon: Package },
];

export function AdminSidebar({ clients, warehouses }: AdminSidebarProps) {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubPath, setActiveSubPath] = useState("/admin/dashboard");

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div>
            <div className="flex my-2">
              <div className="flex align-center w-full justify-between flex-row-reverse">
                <SidebarTrigger />
                <SidebarGroupLabel className="text-lg pb-1">
                  {company.name}
                </SidebarGroupLabel>
              </div>
            </div>
            <Separator orientation="horizontal" className="my-3" />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Static admin items */}
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

              {/* Warehouses Section */}
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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activeSubPath === "/admin/stock"}
                        >
                          <Link
                            href="/admin/stock"
                            onClick={() => {
                              setActiveMenu("warehouse");
                              setActiveSubPath("/admin/stock");
                            }}
                          >
                            <span>All Stocks</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
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
                            <span>All Warehouses</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {warehouses && warehouses.length > 0 ? (
                        warehouses.map((warehouse) => (
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
                                <span>{warehouse.warehouse_name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span className="text-gray-500">No warehouses</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Consignments Section */}
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
                        clients.map((client) => (
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
                                <span>{client.client_name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span className="text-gray-500">No clients</span>
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
