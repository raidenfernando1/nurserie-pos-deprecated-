"use server";
import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteProduct(sku: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db`
      DELETE FROM products
      WHERE sku = ${sku}
    `;

    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
