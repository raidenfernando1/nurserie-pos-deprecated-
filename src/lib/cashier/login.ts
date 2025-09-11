import { authClient } from "../auth-client";
import useError from "@/store/useError";

// this function has ongoing changes
export function useCashierAuth() {
  const { addError } = useError.getState();

  async function Login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const result = await authClient.signIn.email({
        email: `${email}@placeholder.com`,
        password: password,
      });

      if (result) {
        window.location.href = "/cashier/dashboard";
      }

      return result;
    } catch (error) {
      addError("Login failed. Please check your credentials.");
      throw error;
    }
  }

  return { Login };
}
