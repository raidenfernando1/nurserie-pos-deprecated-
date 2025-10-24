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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  PackageSearch,
  ShoppingBasket,
  CreditCard,
  NotepadText,
  UserSearch,
} from "lucide-react";
import { NavUser } from "../navbar-user";
import { useSession } from "@/utils/getSession";
import { company } from "../data";
import { Separator } from "../ui/separator";

export const cashierItems = [
  { name: "Dashboard", path: "/cashier/dashboard", icon: Home },
  { name: "Sales", path: "/cashier/sales", icon: ShoppingBasket },
  { name: "Inventory", path: "/cashier/inventory", icon: PackageSearch },
  { name: "Transactions", path: "/cashier/transactions", icon: CreditCard },
  { name: "Customers", path: "/cashier/customers", icon: UserSearch },
  { name: "Reports", path: "/cashier/reports", icon: NotepadText },
];

export function CashierSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeSubPath, setActiveSubPath] = useState("/cashier/dashboard");
  const { loading } = useSession();

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-4 text-sm text-gray-500">Loading menu…</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <div>
            <div className="flex align-center w-full justify-between flex-row-reverse">
              <SidebarTrigger />
              <SidebarGroupLabel className="text-lg pb-1">
                {company.name}
              </SidebarGroupLabel>
            </div>
          </div>
          <Separator orientation="horizontal" className="my-3" />
          <SidebarGroupContent>
            <SidebarMenu>
              {cashierItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSubPath === item.path}
                  >
                    <Link
                      href={item.path}
                      onClick={() => {
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
