"use client";
import React, { useEffect } from "react";
import LoadingBar from "@/components/loading-page";
import { useWarehouses } from "@/hooks/useWarehouse";

const WarehouseLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useWarehouses();

  return <LoadingBar duration={1500}>{children}</LoadingBar>;
};

export default WarehouseLayout;
