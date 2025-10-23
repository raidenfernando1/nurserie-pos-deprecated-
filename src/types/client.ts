export interface Client {
  id: string;
  name: string;
  email: string;
  code_name?: string;
  serial_key: string;
  date_added: string;
}

export interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;

  fetchClients: () => Promise<void>;

  addClient: (data: {
    name: string;
    code_name?: string;
  }) => Promise<Client | null>;

  updateClient: (
    serial_key: string,
    data: Partial<Pick<Client, "name" | "code_name" | "email">>
  ) => Promise<Client | null>;

  deleteClient: (serial_key: string) => Promise<boolean>;

  findClient: (serial_key: string) => Promise<Client | null>;
}

export interface Consignment {
  consignment_id: number;
  client_id: number;
  client_name: string;
  client_date_added: string;
  warehouse_id: number;
  date_sent: string;
  status: "active" | "inactive";
  consignment_name: string;
  date_not_active: string | null;
}

export interface Consignee {
  client_id: number;
  client_name: string;
  code_name: string;
  serial_key: string;
}

export interface ClientConsignmentStore {
  clientConsignments: Consignment[];
  clientInfo: Consignee[];
  isLoading: boolean;
  error: string | null;
  fetchClientConsignments: (id: string) => Promise<void>;
}
