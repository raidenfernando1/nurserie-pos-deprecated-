"use server";

import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProductAction(
  sku: string,
  data: {
    name?: string;
    description?: string;
    brand?: string;
    category?: string;
    price?: number;
    image_url?: string;
  },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized", success: false };
    }

    const userID = session.user.id;
    if (!userID) {
      return { error: "Unauthorized - User ID required", success: false };
    }

    const { name, description, brand, category, price, image_url } = data;

    const result = await db`
      UPDATE products p
      SET
          name = COALESCE(${name}, p.name),
          description = COALESCE(${description}, p.description),
          brand = COALESCE(${brand}, p.brand),
          category = COALESCE(${category}, p.category),
          price = COALESCE(${price}, p.price),
          image_url = COALESCE(${image_url}, p.image_url)
      WHERE p.sku = ${sku}
      RETURNING p.*;
    `;

    if (result.length === 0) {
      return { error: "Product not found", success: false };
    }

    revalidatePath("/products");
    revalidatePath(`/products/${sku}`);

    return {
      success: true,
      product: result[0],
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Internal server error", success: false };
  }
}
