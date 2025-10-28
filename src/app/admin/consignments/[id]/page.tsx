import ClientConsignmentTable from "./_component/client-consignment-table";
import fetchClientConsignments from "./_action/fetchClientConsignments";

export const dynamic = "force-dynamic";

export default async function ClientConsignmentPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await fetchClientConsignments(params.id);

  if (!result.success) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold text-red-600">
          {result.error || "Failed to load consignments."}
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Consignments for Client #{params.id}</h1>
      <div className="flex-1 min-h-0">
        <ClientConsignmentTable products={result.data} />
      </div>
    </div>
  );
}
