"use server";
import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CreateProductInput } from "@/types/product";

export async function createProduct(data: CreateProductInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const {
      name,
      description,
      brand = "none",
      category,
      sku,
      barcode,
      price = 0,
      image_url,
    } = data;

    if (!name || !sku || !barcode) {
      return {
        success: false,
        error: "Missing required fields: name, sku, or barcode",
      };
    }

    const existing = await db`
      SELECT sku, barcode, name
      FROM products
      WHERE sku = ${sku} OR barcode = ${barcode} OR name = ${name}
      LIMIT 1
    `;

    if (existing.length > 0) {
      const dupField =
        existing[0].sku === sku
          ? "SKU"
          : existing[0].barcode === barcode
          ? "Barcode"
          : "Name";
      return { success: false, error: `Duplicate ${dupField} detected` };
    }

    const finalImageUrl =
      image_url?.trim() ||
      "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png";

    const insertedProduct = await db`
      INSERT INTO products (
        name,
        description,
        brand,
        category,
        sku,
        barcode,
        price,
        image_url
      )
      VALUES (
        ${name},
        ${description},
        ${brand},
        ${category},
        ${sku},
        ${barcode},
        ${price},
        ${finalImageUrl}
      )
      RETURNING *;
    `;

    // <-- revalidate the page or path that shows products
    revalidatePath("/admin/products");

    return { success: true, product: insertedProduct[0] as CreateProductInput };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
