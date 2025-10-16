import React, { useState } from "react";
import { Loader2Icon, Settings } from "lucide-react";
import { EllipsisVertical, LogOut, Sun, Moon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/utils/getSession";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavSettings } from "./nav-settings";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);
  const { userSession, loading } = useSession();

  if (loading || !userSession?.user) {
    return <div className="p-4 text-sm ">Loading user...</div>;
  }

  const { name, email, image } = userSession.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Settings className="mr-2 h-4 w-4" />
              <NavSettings />
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={signingOut}
              className="cursor-pointer"
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
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
