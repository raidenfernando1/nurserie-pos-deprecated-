// WarehousePage.tsx (server component)
import WarehouseTable from "./_components/warehouse-table";
import { getWarehouseWithProducts } from "./_action/fetchWarehouseData";

export const dynamic = "force-dynamic"; // ✅ Add this line

export default async function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getWarehouseWithProducts(id);

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>{data.warehouse.warehouse_name}</h1>
      <div className="flex-1 min-h-0">
        <WarehouseTable products={data.products} />
      </div>
    </div>
  );
}
