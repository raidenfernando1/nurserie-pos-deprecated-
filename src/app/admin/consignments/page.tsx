import ClientsTable from "./_components/consignment-table";
import fetchClients from "@/app/admin/consignments/_actions/fetchClients";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const clients = await fetchClients();

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Clients</h1>
      <div className="flex-1 min-h-0">
        <ClientsTable clients={clients} />
      </div>
    </div>
  );
}
