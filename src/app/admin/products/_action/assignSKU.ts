"use server";
import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Assign a SKU to a product manually.
 */
export async function assignSku(productId: number, assignedSku: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    if (!productId || !assignedSku) {
      return { success: false, error: "Missing required fields" };
    }

    const existing = await db`
      SELECT assigned_sku
      FROM assigned_sku
      WHERE assigned_sku = ${assignedSku}
      LIMIT 1;
    `;

    if (existing.length > 0) {
      return { success: false, error: "Assigned SKU already exists" };
    }

    const inserted = await db`
      INSERT INTO assigned_sku (product_id, assigned_sku)
      VALUES (${productId}, ${assignedSku})
      RETURNING *;
    `;

    revalidatePath("/admin/products");

    return { success: true, assigned: inserted[0] };
  } catch (error) {
    console.error("Error assigning SKU:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch all assigned SKUs for a given product ID.
 */
export async function getAssignedSkus(productId: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    if (!productId) {
      return { success: false, error: "Missing product ID" };
    }

    const skus = await db`
      SELECT assigned_sku
      FROM assigned_sku
      WHERE product_id = ${productId}
      ORDER BY assigned_sku ASC;
    `;

    return { success: true, assignedSkus: skus };
  } catch (error) {
    console.error("Error fetching assigned SKUs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
