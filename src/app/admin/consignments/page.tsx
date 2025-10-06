"use client";
import React, { useEffect } from "react";
import ReusableTable from "../warehouse/_component/product-container";
import ClientTab from "./_components/client-tab";
import { Columns } from "./_components/client-columns";
import useClient from "./_store/useClient";
import Layout from "./layout";
import { useState } from "react";
import AddClient from "./_components/_popups/add-client";
import DeleteClient from "./_components/_popups/delete-client";
import EditClient from "./_components/_popups/edit-client";
import ClientHeader from "./_components/client-header";

const ClientsPage = () => {
  const { clients } = useClient();
  const [popup, setPopup] = useState<"add" | "delete" | "edit" | undefined>(
    undefined,
  );
  return (
    <>
      {popup === "add" && (
        <AddClient
          open={true}
          onOpenChange={(open) => !open && setPopup(undefined)}
        />
      )}
      {popup === "edit" && (
        <EditClient
          open={true}
          onOpenChange={(open) => !open && setPopup(undefined)}
        />
      )}
      {popup === "delete" && (
        <DeleteClient
          open={true}
          onOpenChange={(open) => !open && setPopup(undefined)}
        />
      )}
      <ClientHeader
        onAddClient={() => setPopup("add")}
        onEditClient={() => setPopup("edit")}
        onDeleteClient={() => setPopup("delete")}
      />
      <ReusableTable
        data={clients}
        columns={Columns}
        tabComponent={(table) => <ClientTab table={table} />}
        defaultPageSize={10}
      />
    </>
  );
};

export default ClientsPage;
