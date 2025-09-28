"use client";
import React, { useEffect } from "react";
import LoadingBar from "@/components/LoadingPage";
import { useWarehouses } from "@/hooks/useWarehouse";

const WarehouseLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useWarehouses();

  useEffect(() => {
    if (data) {
      console.log("Warehouses loaded:", data);
    }
  }, [data]);

  return <LoadingBar duration={500}>{children}</LoadingBar>;
};

export default WarehouseLayout;
