"use client";

import { notFound } from "next/navigation";
import React from "react";
import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";

const adminItems = [
  { name: "Warehouse", path: "/admin/warehouse" },
  { name: "Staff", path: "/admin/staff" },
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
    return (
      <>
        {adminItems.map((data, index) => {
          return (
            <a key={index} href={data.path}>
              {data.name}
            </a>
          );
        })}
      </>
    );
  }

  if (role === "cashier") {
    return <h1>cashier</h1>;
  }
}
