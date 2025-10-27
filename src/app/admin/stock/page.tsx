import StockTable from "./_components/stock-table";
import getWarehouseProducts from "./_action/fetchStockedProducts";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const stocks = await getWarehouseProducts();

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Products</h1>
      <div className="flex-1 min-h-0">
        <StockTable stocks={stocks} />
      </div>
    </div>
  );
}
