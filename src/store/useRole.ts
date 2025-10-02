import { create } from "zustand";
import { RoleStore } from "@/types/user";
import type { Roles } from "@/types/user";

const useRole = create<RoleStore>((set) => ({
  role: undefined,
  setRole: (role) => set({ role }),
}));

export default useRole;
