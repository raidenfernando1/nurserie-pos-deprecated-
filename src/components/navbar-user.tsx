import React, { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { ChevronsUpDown, LogOut, Sun, Moon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/utils/getSession";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);
  const { userSession, loading } = useSession();
  const { theme, setTheme } = useTheme();

  if (loading || !userSession?.user) {
    return <div className="p-4 text-sm ">Loading user...</div>;
  }

  const { name, email, image } = userSession.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={image ?? ""} />
                <AvatarFallback className="rounded-lg">
                  {name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="flex justify-between w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              disabled={signingOut}
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
            <Button
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
