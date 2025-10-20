"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface TransferProductPayload {
  warehouseID: string | number;
  to_warehouseID: string | number;
  productID: string | number;
  send_stock: number;
  stock_threshold: number;
}

export async function transferProductBetweenWarehouses(
  payload: TransferProductPayload,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin") {
    throw new Error("Admin access required");
  }

  const {
    warehouseID,
    to_warehouseID,
    productID,
    send_stock,
    stock_threshold,
  } = payload;

  // Validate required fields
  if (
    !warehouseID ||
    !to_warehouseID ||
    !productID ||
    !send_stock ||
    !stock_threshold
  ) {
    throw new Error("Missing required fields");
  }

  try {
    // Check source warehouse stock
    const [source] = await db`
      SELECT stock FROM warehouse_products
      WHERE warehouse_id = ${warehouseID} AND product_id = ${productID}
    `;

    if (!source) {
      throw new Error("Product not found in source warehouse");
    }

    if (source.stock < send_stock) {
      throw new Error(
        `Insufficient stock. Available: ${source.stock}, Requested: ${send_stock}`,
      );
    }

    // Deduct from source warehouse
    await db`
      UPDATE warehouse_products
      SET stock = stock - ${send_stock}
      WHERE warehouse_id = ${warehouseID} AND product_id = ${productID}
      RETURNING stock
    `;

    // Add to destination warehouse
    await db`
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      VALUES (${to_warehouseID}, ${productID}, ${send_stock}, ${stock_threshold})
      ON CONFLICT (warehouse_id, product_id)
      DO UPDATE SET
        stock = warehouse_products.stock + EXCLUDED.stock,
        stock_threshold = EXCLUDED.stock_threshold
      RETURNING stock
    `;

    // Revalidate both warehouse pages
    revalidatePath(`/admin/warehouse/${warehouseID}`);
    revalidatePath(`/admin/warehouse/${to_warehouseID}`);

    return { success: true };
  } catch (error) {
    console.error("transferProductBetweenWarehouses error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to transfer product",
    );
  }
}
