import fetchInventory from "./_action/getInventory";
import InventoryTable from "./_components/inventory-table";

async function ProductPage() {
  const products = await fetchInventory();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-6 bg-background">
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>

      <div className="flex-1 min-h-0 p-6 text-center">
        <InventoryTable products={products} />
      </div>
    </div>
  );
}

export default ProductPage;
