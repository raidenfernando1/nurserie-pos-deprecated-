"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { AddProductToWarehousePayload } from "@/types/warehouse";

export interface AddStockPayload {
  warehouseID: any;
  sku: string;
  stockToAdd: number;
}

export async function addStockToWarehouse(payload: AddStockPayload) {
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

    // Check if product exists in the warehouse
    const [existing] = await db`
      SELECT * FROM warehouse_products
      WHERE warehouse_id = ${payload.warehouseID} AND product_id = ${product.id}
    `;

    if (!existing) {
      throw new Error("Product does not exist in this warehouse");
    }

    // Update stock
    const [updated] = await db`
      UPDATE warehouse_products
      SET stock = stock + ${payload.stockToAdd}
      WHERE warehouse_id = ${payload.warehouseID} AND product_id = ${product.id}
      RETURNING *;
    `;

    // Revalidate the warehouse page to show updated data
    revalidatePath(`/admin/warehouse/${payload.warehouseID}`);

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("addStockToWarehouse error:", error);
    throw new Error(
      error.message || "Failed to add stock to warehouse product"
    );
  }
}

export async function addProductToWarehouse(
  payload: AddProductToWarehousePayload
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

    // Check if product already exists in this warehouse
    const [existing] = await db`
      SELECT * FROM warehouse_products
      WHERE warehouse_id = ${payload.warehouseID} AND product_id = ${product.id}
    `;

    if (existing) {
      throw new Error("Product already exists in this warehouse");
    }

    // Insert new product
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
  } catch (error: any) {
    console.error("addProductToWarehouse error:", error);
    throw new Error(error.message || "Failed to add product to warehouse");
  }
}

export async function deleteProductFromWarehouse(
  warehouseID: number,
  productID: number
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await db`
      DELETE FROM warehouse_products
      WHERE warehouse_id = ${warehouseID} AND product_id = ${productID}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("Product not found in this warehouse");
    }

    revalidatePath(`/admin/warehouse/${warehouseID}`);

    return {
      success: true,
      message: "Product removed from warehouse successfully.",
    };
  } catch (error) {
    console.error("deleteProductFromWarehouse error:", error);
    throw new Error("Failed to delete product from warehouse");
  }
}
