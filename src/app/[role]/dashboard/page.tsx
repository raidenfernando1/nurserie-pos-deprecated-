"use client";
import { notFound } from "next/navigation";
import React from "react";
import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";
import AdminView from "./Admin";
import CashierView from "./Cashier";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const DASHBOARD_VALID_ROLES = ["admin", "cashier"];
  const { role, setRole } = useRole();

  const { role: paramRole } = React.use(params);

  if (!DASHBOARD_VALID_ROLES.includes(paramRole)) {
    notFound();
  }

  React.useEffect(() => {
    authClient.getSession().then((session) => {
      const role = session.data?.user.role;
      if (role === "admin" || role === "cashier") {
        setRole(role);
      }
    });
  }, [setRole]);

  if (role === "admin") {
    return <AdminView />;
  }

  if (role === "cashier") {
    return <CashierView />;
  }

  return null;
}
