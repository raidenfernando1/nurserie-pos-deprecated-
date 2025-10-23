"use server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

export async function changePassword(userId: string, newPassword: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const data = await auth.api.setUserPassword({
    body: {
      newPassword: newPassword,
      userId: userId,
    },
    headers: await headers(),
  });

  return { data };
}
