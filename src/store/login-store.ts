import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

interface LoginStore {
  isLoading: boolean;
  fetchSession: () => Promise<any | null>;
  loginAdmin: () => Promise<{
    success: boolean;
    code?: number;
    message?: string;
  }>;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  isLoading: false,

  fetchSession: async () => {
    const session = await authClient.getSession();
    return session;
  },

  loginAdmin: async () => {
    set({ isLoading: true });
    try {
      const login = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/api/auth/check",
      });

      if (login.error) {
        throw new Error(
          `${login.error.message ?? "Login failed"} (code: ${login.error.code ?? "unknown"})`,
        );
      }

      return {
        success: true,
        code: 201,
      };
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error("Login failed:", err);

      return {
        success: false,
        message: err.message || "Unexpected error occurred",
      };
    } finally {
      set({ isLoading: false });
    }
  },
}));
