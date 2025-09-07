import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";

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

const DASHBOARD_ITEMS: Record<string, { name: string; path: string }[]> = {
  admin: adminItems,
  staff: staffItems,
  cashier: cashierItems,
};

export default function DashboardLayout({
  params,
  children,
}: {
  params: { role: string };
  children: React.ReactNode;
}) {
  const { role } = params;

  if (!(role in DASHBOARD_ITEMS)) {
    notFound();
  }

  const items = DASHBOARD_ITEMS[role];

  return (
    <main className="flex flex-col">
      <Navbar />
      <section className="flex-1 p-4">{children}</section>
    </main>
  );
}
