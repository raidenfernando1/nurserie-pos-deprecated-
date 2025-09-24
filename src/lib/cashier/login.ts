import { authClient } from "../auth-client";

export function useCashierAuth() {
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
      throw error;
    }
  }

  return { Login };
}
