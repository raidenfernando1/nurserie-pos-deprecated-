"use client";
import React from "react";
import LoadingBar from "@/components/loading-page";

const WarehouseLayout = ({ children }: { children: React.ReactNode }) => {
  return <LoadingBar duration={1500}>{children}</LoadingBar>;
};

export default WarehouseLayout;
