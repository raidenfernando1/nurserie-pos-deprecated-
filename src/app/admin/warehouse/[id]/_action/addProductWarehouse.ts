"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { AddProductToWarehousePayload } from "@/types/warehouse";

export async function addProductToWarehouse(
  payload: AddProductToWarehousePayload,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Get product_id from SKU
    const [product] = await db`
      SELECT id FROM products WHERE sku = ${payload.sku}
    `;

    if (!product) {
      throw new Error("Product not found");
    }

    const result = await db`
      INSERT INTO warehouse_products (
        warehouse_id,
        product_id,
        stock,
        stock_threshold
      )
      VALUES (
        ${payload.warehouseID},
        ${product.id},
        ${payload.stock},
        ${payload.stock_threshold}
      )
      RETURNING *;
    `;

    const newWarehouseProduct = result[0];

    // Revalidate the warehouse page to show updated data
    revalidatePath(`/admin/warehouse/${payload.warehouseID}`);

    return { success: true, data: newWarehouseProduct };
  } catch (error) {
    console.error("addProductToWarehouse error:", error);
    throw new Error("Failed to add product to warehouse");
  }
}
