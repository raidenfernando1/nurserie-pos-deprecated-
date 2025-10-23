import CustomersTable from "./_components/customers-table";
// actions
import { getCustomers } from "./_action/fetchCustomers";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Customers</h1>
      <div className="flex-1 min-h-0">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
