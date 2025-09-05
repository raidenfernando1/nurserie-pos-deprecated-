// /lib/adminAuth.ts
import { authClient } from "@/lib/auth-client";
import useError from "@/store/useError";

export function useAdminAuth() {
  const { addError } = useError.getState();

  async function Login() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account/admin/dashboard",
      });
    } catch (e) {
      addError(`CATCH ERROR: oauth admin login error | ${e}`);
      return false;
    }
  }

  async function Logout() {
    try {
      await authClient.signOut();
      window.location.href = "/account/admin";
      return true;
    } catch (e) {
      addError(`CATCH ERROR: oauth admin signout error | ${e}`);
      return false;
    }
  }

  return { Login, Logout };
}
