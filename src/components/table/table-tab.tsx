import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";

interface FilterOption {
  columnId: string;
  label: string;
  options: string[];
  placeholder?: string;
  width?: string;
}

interface TabProps {
  table: any;
  filters?: FilterOption[];
  actions?: ReactNode;
  searchPlaceholder?: string;
}

const Tab = ({
  table,
  filters = [],
  actions,
  searchPlaceholder = "Search...",
}: TabProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1">
        <Input
          placeholder={searchPlaceholder}
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>

      {filters.map((filter, index) => (
        <Select
          key={index}
          value={table.getColumn(filter.columnId)?.getFilterValue() ?? "all"}
          onValueChange={(value) =>
            table
              .getColumn(filter.columnId)
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className={filter.width || "w-[180px]"}>
            <SelectValue placeholder={filter.placeholder || filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((option, optIndex) => (
              <SelectItem key={optIndex} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* Actions */}
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default Tab;
