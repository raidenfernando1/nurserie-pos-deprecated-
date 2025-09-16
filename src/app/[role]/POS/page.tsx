import Search from "./Search";
import ProductCard from "./ProductCard";
import CartTab from "./CartTab";

function Sales() {
  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex-3 flex flex-col">
        <Search />
        <ProductCard />
      </div>
      <div className="flex-1">
        <CartTab />
      </div>
    </div>
  );
}

export default Sales;
