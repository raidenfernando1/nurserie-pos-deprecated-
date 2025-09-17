import { Button } from "@/components/ui/button";

interface Product {
  img_url: string | null;
  name: string;
  category: string;
  sku: string;
  stock_threshold: number;
  price: number;
  stock: number;
  status: "in-stock" | "out-of-stock";
}

interface FiltersProps {
  table: any;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: string[];
}

const Filters: React.FC<FiltersProps> = ({
  table,
  globalFilter,
  setGlobalFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => {
  return (
    <div className="flex justify-between gap-4 items-center">
      <input
        type="text"
        placeholder="Search by name..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="border px-2 py-1 rounded bg-[var(--background)]"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="flex gap-8 w-2/4 justify-end items-center mt-2">
        <Button
          variant="secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded"
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Filters;
