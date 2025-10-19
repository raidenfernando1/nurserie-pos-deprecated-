import WarehouseTable from "./_components/warehouse-table";

// actions
import fetchWarehouses from "./_action/fetchWarehouses";

export default async function ProductsPage() {
  const warehouses = await fetchWarehouses();

  if ("error" in warehouses) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: {warehouses.error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Warehouses</h1>
      <div className="flex-1 min-h-0">
        <WarehouseTable warehouses={warehouses} />
      </div>
    </div>
  );
}
