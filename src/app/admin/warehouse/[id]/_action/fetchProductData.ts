"use server";

import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import type { CreateProductInput } from "@/types/product";

export async function fetchProductData(sku: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const product = await db`
      SELECT
        id,
        name,
        description,
        brand,
        category,
        sku,
        barcode,
        price,
        image_url
      FROM products
      WHERE sku = ${sku}
      LIMIT 1;
    `;

    if (product.length === 0)
      return { success: false, error: "Product not found" };

    return { success: true, product: product[0] as CreateProductInput };
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
