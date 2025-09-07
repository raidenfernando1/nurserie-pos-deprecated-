import { notFound } from "next/navigation";

const adminItems = [
  { name: "Analytics", path: "/dashboard/analytics" },
  { name: "Inventory", path: "/dashboard/inventory" },
  { name: "Settings", path: "/dashboard/settings" },
  { name: "Settings", path: "/dashboard/settings" },

  { name: "Staff", path: "/dashboard/users" },
];

const staffItems = [
  { name: "Analytics", path: "/account/admin/dashboard/analytics" },
  { name: "Inventory", path: "/account/admin/dashboard/inventory" },
  { name: "Settings", path: "/account/admin/dashboard/settings" },
  { name: "Staff", path: "/account/admin/dashboard/users" },
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
  const DASHBOARD_VALID_ROLES = ["admin", "cashier", "staff"];

  if (!DASHBOARD_VALID_ROLES.includes(params.role)) {
    notFound();
  }

  return <h1>{params.role} dashboard</h1>;
}
