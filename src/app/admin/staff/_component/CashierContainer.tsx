"use client";

import { useQuery } from "@tanstack/react-query";

const fetchCashiers = async () => {
  const res = await fetch("/api/admin/cashier");
  if (!res.ok) throw new Error("Failed to fetch cashiers");
  return res.json();
};

const CashierContainer = () => {
  const {
    data: cashiers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cashiers"],
    queryFn: fetchCashiers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      {cashiers.map((cashier: any) => (
        <div key={cashier.id} className="py-8">
          <li>{cashier.id}</li>
          <li>{cashier.createdAt}</li>
          <li>{cashier.name}</li>
        </div>
      ))}
    </div>
  );
};

export default CashierContainer;
