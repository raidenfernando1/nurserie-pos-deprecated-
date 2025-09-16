"use client";
import React from "react";
import { Product } from "./ProductCard";

// 🔹 Reusable Search input
function Search({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex gap-4 w-full">
      <input
        className="flex-1 p-2 border rounded"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />
      <select name="category" className="py-2 px-4 border rounded text-md">
        <option value="accessory">Accessory</option>
        <option value="baby-clothing">Baby Clothing</option>
        <option value="carrier">Carrier</option>
        <option value="decor">Decor</option>
        <option value="display">Display</option>
        <option value="feeding">Feeding</option>
        <option value="latex">Latex</option>
        <option value="nursery">Nursery</option>
        <option value="oral-care">Oral Care</option>
        <option value="otg">OTG</option>
        <option value="packaging">Packaging</option>
        <option value="play">Play</option>
        <option value="set">Set</option>
        <option value="silicone">Silicone</option>
        <option value="skin-care">Skin Care</option>
        <option value="textile">Textile</option>
        <option value="freebie">Freebie</option>
        <option value="bunny">Bunny</option>
        <option value="bear">Bear</option>
        <option value="organic-bear">Organic Bear</option>
      </select>
    </div>
  );
}

function SearchableList() {
  const [query, setQuery] = React.useState<string>("");

  const filteredItems = Product.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {" "}
      <Search query={query} setQuery={setQuery} />
      {query && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto z-50">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="p-2 border-b last:border-none hover:bg-gray-50"
              >
                {item.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchableList;
