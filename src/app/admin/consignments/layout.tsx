"use client";

import React, { ReactNode, useEffect } from "react";
import useClient from "./_store/useClient";

const Layout = ({ children }: { children: ReactNode }) => {
  const { isLoading, fetchClients } = useClient();

  useEffect(() => {
    fetchClients();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default Layout;
