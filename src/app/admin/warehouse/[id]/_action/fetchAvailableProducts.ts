"use server";

import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

export async function fetchAvailableProducts() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const products = await db`
        SELECT
            p.id,
            p.name,
            p.brand,
            p.category,
            p.image_url,
            p.price,
            p.sku,
            p.barcode
        FROM products p
        ORDER BY p.name;
    `;

    return { success: true, products };
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
