import { Roles } from "@/app/types/roles";
import { authClient } from "./auth-client";

export default async function Logout(role: Roles): Promise<boolean> {
  try {
    console.log("123");

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
        console.log(res);

        window.location.href = "/";
        break;
    }

    return true;
  } catch (e) {
    console.error(`CATCH ERROR: oauth ${role} signout error | ${e}`);
    return false;
  }
}
