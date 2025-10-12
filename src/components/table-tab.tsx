import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface TabProps {
  table: any;
  categories: string[];
  actions?: ReactNode;
}

const Tab = ({ table, categories, actions }: TabProps) => {
  const pageIndex = table.getState().pagination.pageIndex + 1;
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
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default Tab;
