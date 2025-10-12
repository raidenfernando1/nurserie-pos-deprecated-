import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TabProps {
  table: any;
  warehouses: string[];
  categories: string[];
  itemAmount?: number;
}

const Tab = ({ table, warehouses, categories }: TabProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 border-2 rounded-md">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <Select
        value={table.getColumn("category")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table
            .getColumn("category")
            ?.setFilterValue(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category, index) => (
            <SelectItem key={index} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Warehouse Filter */}
      <Select
        value={table.getColumn("warehouse_name")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table
            .getColumn("warehouse_name")
            ?.setFilterValue(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Warehouses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Warehouses</SelectItem>
          {warehouses.map((warehouse, index) => (
            <SelectItem key={index} value={warehouse}>
              {warehouse}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Tab;
