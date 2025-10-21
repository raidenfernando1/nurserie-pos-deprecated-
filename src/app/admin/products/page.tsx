// ProductsPage.tsx (server component)
import ProductsTable from "./_components/products-table";
import fetchProducts from "@/app/admin/products/_action/getProducts";

export const dynamic = "force-dynamic"; // ✅ Add this line

export default async function ProductsPage() {
  const products = await fetchProducts();

  if ("error" in products) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: {products.error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-3 flex flex-col gap-3">
      <h1>Products</h1>
      <div className="flex-1 min-h-0">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
