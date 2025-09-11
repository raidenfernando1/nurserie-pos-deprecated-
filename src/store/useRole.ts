import { create } from "zustand";
import type { Roles } from "@/app/types/roles";

interface RoleStoreTypes {
  role: Roles | undefined;
  setRole: (role: Roles | undefined) => void;
}

const useRole = create<RoleStoreTypes>((set) => ({
  role: undefined,
  setRole: (role) => set({ role }),
}));

export default useRole;
