import { create } from "zustand";
import { ClientConsignmentStore } from "@/types/client";

export const useConsignments = create<ClientConsignmentStore>((set, get) => ({
  clientConsignments: [],
  clientInfo: [],
  isLoading: false,
  error: null,

  fetchConsignee: async (id: string) => {},

  fetchClientConsignments: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`/api/admin/consignment?search=${id}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch consignments");
      }

      console.log(result);

      set({
        clientConsignments: result.data || [],
        clientInfo: result.info || [],
        isLoading: false,
      });
    } catch (e: any) {
      set({
        error: e.message || "Something went wrong.",
        isLoading: false,
      });
      console.error("fetchClientConsignments error:", e);
    }
  },
}));
