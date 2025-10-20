import UserTable from "./_component/user-table";
// actions
import { getCashiers } from "./_action/fetchUsers";

export default async function UsersPage() {
  const result = await getCashiers();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: Failed to load users</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Users</h1>
      <div className="flex-1 min-h-0">
        <UserTable users={result.data} />
      </div>
    </div>
  );
}
