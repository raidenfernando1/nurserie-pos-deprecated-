import Navbar from "./navbar";
import { ReactNode } from "react";

const adminList = [
  { name: "Analytics", path: "/account/admin/dashboard/analytics" },
  { name: "Inventory", path: "/account/admin/dashboard/inventory" },
  { name: "Settings", path: "/account/admin/dashboard/settings" },
  { name: "Staff", path: "/account/admin/dashboard/users" },
];

export default function Dashboard({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="p-12">{children}</main>
    </>
  );
}
