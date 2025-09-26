import { authClient } from "@/lib/auth-client";
import useRole from "@/store/useRole";

export function useAdminAuth() {
  const { setRole } = useRole();

  async function Login() {
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

  return { Login };
}
