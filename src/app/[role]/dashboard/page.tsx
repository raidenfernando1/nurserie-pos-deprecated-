"use client";

import { notFound } from "next/navigation";
import DashboardCard from "@/components/DashboardCard";
import React from "react";
import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";

const adminItems = [
  { name: "Analytics", path: "/dashboard/analytics" },
  { name: "Inventory", path: "/dashboard/inventory" },
  { name: "Settings", path: "/dashboard/settings" },
  { name: "Settings", path: "/dashboard/settings" },
];

const cashierItems = [
  { name: "Analytics", path: "/account/admin/dashboard/analytics" },
  { name: "Inventory", path: "/account/admin/dashboard/inventory" },
  { name: "Settings", path: "/account/admin/dashboard/settings" },
  { name: "Inventory", path: "/account/admin/dashboard/inventory" },
];

export default function DashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const DASHBOARD_VALID_ROLES = ["admin", "cashier"];
  const { role, setRole } = useRole();

  if (!DASHBOARD_VALID_ROLES.includes(params.role)) {
    notFound();
  }

  React.useEffect(() => {
    authClient.getSession().then((session) => {
      const role = session.data?.user.role;
      if (role === "admin" || role === "cashier") {
        setRole(role);
      }
    });
  }, []);

  if (role === "admin") {
    return <h1>admin</h1>;
  }

  if (role === "cashier") {
    return <h1>cashier</h1>;
  }
}
