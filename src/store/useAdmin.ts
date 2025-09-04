import { create } from "zustand";

interface AdminStoreTypes {
  adminUsername: string | undefined;
  setAdminUsername: (status: string) => void;
}

const useAdmin = create<AdminStoreTypes>((set) => ({
  adminUsername: "admin",
  setAdminUsername: (value) => set(() => ({ adminUsername: value })),
}));

export default useAdmin;
