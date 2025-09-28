import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const Tab = ({ table, categories }: { table: any; categories: string[] }) => {
  const pageIndex = table.getState().pagination.pageIndex + 1; // 0-based index
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 border-2 rounded-md">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>

      <Button asChild variant="outline">
        <select
          className="bg-inherit"
          onChange={(e) =>
            table
              .getColumn("brand_category")
              ?.setFilterValue(e.target.value || undefined)
          }
        >
          <option value="">Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Button>
    </div>
  );
};

export default Tab;
