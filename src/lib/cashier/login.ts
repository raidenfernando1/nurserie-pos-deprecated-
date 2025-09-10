import { authClient } from "../auth-client";
import useError from "@/store/useError";

// this function has ongoing changes
export function useCashierAuth() {
  const { addError } = useError.getState();

  async function Login({ email, password }) {
    try {
      const result = await authClient.signIn.email({
        email: email,
        password: password,
      });

      return result;
    } catch (error) {
      addError(error.message || "Login failed. Please check your credentials.");
      throw error;
    }
  }

  return { Login };
}
