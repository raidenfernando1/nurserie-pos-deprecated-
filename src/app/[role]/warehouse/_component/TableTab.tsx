import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

const Tab = ({
  table,
  currentPage,
  lastPage,
  categories,
}: {
  table: any;
  currentPage: number;
  lastPage: number;
  categories: string[];
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1">
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
              .getColumn("category")
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

      <Button
        variant="outline"
        className="rounded"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="outline"
        className="rounded"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default Tab;
