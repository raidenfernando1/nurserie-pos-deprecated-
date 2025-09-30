"use client";
import React, { useEffect } from "react";
import LoadingBar from "@/components/LoadingPage";
import { useWarehouses } from "@/hooks/useWarehouse";

const WarehouseLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useWarehouses();

  return <LoadingBar duration={1000}>{children}</LoadingBar>;
};

export default WarehouseLayout;
