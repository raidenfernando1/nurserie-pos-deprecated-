import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";
import type { Roles } from "@/types/user";

export default async function Logout(role: Roles): Promise<boolean> {
  const router = useRouter();

  try {
    const res = await authClient.signOut();

    if (!res) {
      console.error(`Error logging out ${role}`);
      return false;
    }

    switch (role) {
      case "admin":
      case "cashier":
      default:
        console.error(`Unknown role during logout: ${role}`);
        router.push("/");
        break;
    }

    return true;
  } catch (e) {
    console.error(`CATCH ERROR: oauth ${role} signout error | ${e}`);
    return false;
  }
}
