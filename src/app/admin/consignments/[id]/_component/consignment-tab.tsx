import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ClientTab = ({ table }: { table: any }) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 border-2 rounded-md">
        <Input
          placeholder="Search clients..."
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientTab;
