"use client";

import React from "react";
``;
import NavbarCard from "./NavbarCard";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const adminItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Warehouses", path: "/admin/warehouse" },
  { name: "Staff", path: "/admin/staff" },
];

const cashierItems = [{ name: "Cashier Dashboard", path: "/cashier" }];

export default function Sidebar() {
  const [role, setRole] = React.useState<string | null>(null);
  const [activePath, setActivePath] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRole = async () => {
      try {
        const session = await authClient.getSession();
        const role = session?.data?.user?.role ?? null;
        setRole(role);

        if (role === "admin") setActivePath("/admin/dashboard");
        else if (role === "cashier") setActivePath("/cashier");
      } catch (err) {
        console.error("Failed to fetch role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading || !role) {
    return null;
  }

  const itemsToRender =
    role === "admin" ? adminItems : role === "cashier" ? cashierItems : [];

  return (
    <nav className="flex-shrink-0 w-64 h-screen flex flex-col sticky top-0 p-6 border-r">
      <p className="font-semibold">George - POS</p>
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 pt-9">
          {itemsToRender.map((item) => (
            <NavbarCard
              key={item.path}
              name={item.name}
              path={item.path}
              active={activePath === item.path}
              className="cursor-pointer"
              onClick={() => setActivePath(item.path)}
            />
          ))}
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            className="w-full rounded-[0.3rem]"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/";
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
