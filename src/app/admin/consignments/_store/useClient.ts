import { create } from "zustand";
import { createClient } from "../_lib/createClient";
import { ClientStore } from "@/types/client";

const useClient = create<ClientStore>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,
  clientConsignments: [],

  deleteClient: async (serial_key: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/admin/client?serial_key=${serial_key}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to delete client");

      set((state) => ({
        clients: state.clients.filter((c) => c.serial_key !== serial_key),
        isLoading: false,
      }));
      return true;
    } catch (err: any) {
      console.error("❌ Delete error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  updateClient: async (serial_key: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const updates: any = { serial_key };
      if (data.name && data.name.trim()) updates.name = data.name.trim();
      if (data.code_name && data.code_name.trim())
        updates.code_name = data.code_name.trim();

      console.log("🔄 Updating client:", updates); // Debug log

      const res = await fetch("/api/admin/client", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await res.json();
      console.log("📨 Response:", result); // Debug log

      if (!res.ok) throw new Error(result.error || "Failed to update client");

      set((state) => ({
        clients: state.clients.map((c) =>
          c.serial_key === serial_key ? { ...c, ...result.data } : c
        ),
        isLoading: false,
      }));
      return result.data;
    } catch (err: any) {
      console.error("❌ Update error:", err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  findClient: async (identifier: string) => {
    try {
      const res = await fetch(`/api/admin/client?search=${identifier}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to find client");
      return result.data?.[0] || null;
    } catch (err: any) {
      console.error("❌ Find error:", err);
      return null;
    }
  },

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/admin/client");
      const result = await response.json();

      set({ clients: result.data || [], isLoading: false });
    } catch (error) {
      console.error("Fetch error:", error);
      set({ error: "Failed to fetch clients", isLoading: false });
    }
  },

  addClient: async ({ name, code_name }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/admin/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, code_name: code_name }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add client");

      const newClient = result.data;

      set((state) => ({
        clients: [...state.clients, newClient],
        isLoading: false,
      }));

      return newClient;
    } catch (err) {
      console.error("Add client error:", err);
      set({ error: "Failed to add client", isLoading: false });
      return null;
    }
  },
}));

export default useClient;
