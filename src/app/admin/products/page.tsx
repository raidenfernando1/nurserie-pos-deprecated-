"use client";
import { useEffect } from "react";
import ReusableTable from "../warehouse/_component/product-container";
import { useProductStore } from "@/store/product-store";
import { Columns } from "./_component/product-columns";
import Header from "./_component/product-header";
import PopupHandler from "./_component/popup-handler";

const Products = () => {
  const { fetchAllProducts, products } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <PopupHandler>
      <div className="h-screen p-3 flex flex-col gap-3">
        <Header />
        <div className="flex-1 min-h-0">
          <ReusableTable data={products} columns={Columns} />
        </div>
      </div>
    </PopupHandler>
  );
};

export default Products;
