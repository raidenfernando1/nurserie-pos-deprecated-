"use client";

import React, { useEffect } from "react";
import ReusableTable from "../../warehouse/_component/product-container";
import { Columns } from "../[id]/_component/consignment-columns";
import ClientTab from "../_components/client-tab";
import { useConsignments } from "../_store/useConsignments";
import ClientHeader from "../_components/client-header";

const ClientsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { fetchClientConsignments, isLoading, clientConsignments, clientInfo } =
    useConsignments();

  const { id } = React.use(params);

  useEffect(() => {
    if (id) {
      fetchClientConsignments(id);
    }
  }, [id, fetchClientConsignments]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <ClientHeader
        title={clientInfo[0]?.client_name ?? "Unknown Client"}
        showConsignmentsAction={true}
        showActions={false}
      />

      <ReusableTable
        data={clientConsignments}
        columns={Columns}
        tabComponent={(table) => <ClientTab table={table} />}
        defaultPageSize={10}
      />
    </>
  );
};

export default ClientsPage;
