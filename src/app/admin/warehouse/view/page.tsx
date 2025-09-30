"use client";

import useWarehouseStore from "@/store/useWarehouse";
import Table from "./_component/Table";

const Page = () => {
  const { warehouses } = useWarehouseStore();

  return <Table data={warehouses} />;
};

export default Page;
