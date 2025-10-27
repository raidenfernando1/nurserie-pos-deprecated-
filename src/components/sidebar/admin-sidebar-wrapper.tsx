import fetchClients from "@/app/admin/consignments/_actions/fetchClients";
import fetchWarehouses from "@/app/admin/warehouse/_action/fetchWarehouses";
import { AdminSidebar } from "./admin-sidebar";

export default async function AdminSidebarWrapper() {
  const clients = await fetchClients();
  const warehouses = await fetchWarehouses();

  return <AdminSidebar clients={clients} warehouses={warehouses} />;
}
