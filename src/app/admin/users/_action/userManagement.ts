"use server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const banUser = async (userId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const data = await auth.api.banUser({
      body: {
        userId,
      },
      headers: await headers(),
    });

    revalidatePath("/admin/users");
    return { success: true, data };
  } catch (error: any) {
    console.error("Ban user error:", error);
    throw new Error(error.message || "Failed to ban user");
  }
};

export const unbanUser = async (userId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const data = await auth.api.unbanUser({
      body: {
        userId,
      },
      headers: await headers(),
    });

    revalidatePath("/admin/users");
    return { success: true, data };
  } catch (error: any) {
    console.error("Unban user error:", error);
    throw new Error(error.message || "Failed to unban user");
  }
};
