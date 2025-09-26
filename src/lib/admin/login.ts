import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";

export function useAdminAuth() {
  const { setRole } = useRole();

  async function login() {
    try {
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/api/auth/check",
      });

      if (!response) return;

      const session = await authClient.getSession();
      const role = session.data?.user.role;

      if (role !== "admin") {
        throw new Error("Logged in user not admin");
      }

      setRole(role);
    } catch (e) {
      return false;
    }
  }

  const createCashier = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const { data: user, error } = await authClient.admin.createUser({
        email: `${email}@placeholder.com`,
        password: password,
        name: name,
        role: "user",
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, user: user };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create cashier");
    }
  };

  return { login, createCashier };
}
