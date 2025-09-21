// /lib/adminAuth.ts
import { authClient } from "@/lib/auth-client";
import useError from "@/store/useError";
import useRole from "@/store/useRole";

export function useAdminAuth() {
  const { addError } = useError.getState();
  const { setRole } = useRole.getState();

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
        addError("Error logged in not admin");
        throw new Error("Logged in user not admin");
      }

      setRole(role);
    } catch (e) {
      addError(`CATCH ERROR: oauth admin login error | ${e}`);
      return false;
    }
  }

  return { Login };
}
