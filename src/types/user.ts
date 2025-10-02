export interface RoleStore {
  role: Roles | undefined;
  setRole: (role: Roles | undefined) => void;
}

export type Roles = "admin" | "cashier" | "user";
