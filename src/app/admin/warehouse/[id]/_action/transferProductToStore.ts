"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface TransferProductToStorePayload {
  storeID: number;
  warehouseID: number;
  sku: string;
  quantity: number;
  threshold?: number;
}

export async function transferProductToStore(
  payload: TransferProductToStorePayload,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Get product ID
    const [product] = await db`
      SELECT id FROM products WHERE sku = ${payload.sku}
    `;
    if (!product) throw new Error("Product not found");

    // 2. Check warehouse stock
    const [warehouseProduct] = await db`
      SELECT stock
      FROM warehouse_products
      WHERE warehouse_id = ${payload.warehouseID}
        AND product_id = ${product.id}
    `;

    if (!warehouseProduct) {
      throw new Error(
        `Product ${payload.sku} not found in warehouse ${payload.warehouseID}`,
      );
    }

    if (warehouseProduct.stock < payload.quantity) {
      throw new Error(
        `Not enough stock in warehouse (available: ${warehouseProduct.stock}, requested: ${payload.quantity})`,
      );
    }

    const thresholdValue = payload.threshold ?? 0;

    // 3. Update or insert store inventory (no warehouse_id)
    const [existingStoreInventory] = await db`
      SELECT stock
      FROM store_inventory
      WHERE product_id = ${product.id}
        AND store_id = ${payload.storeID}
    `;

    if (existingStoreInventory) {
      // Update existing inventory
      await db`
        UPDATE store_inventory
        SET stock = stock + ${payload.quantity},
            threshold = ${thresholdValue}
        WHERE product_id = ${product.id}
          AND store_id = ${payload.storeID}
      `;
    } else {
      // Insert new inventory record
      await db`
        INSERT INTO store_inventory (store_id, product_id, stock, threshold, created_at)
        VALUES (
          ${payload.storeID},
          ${product.id},
          ${payload.quantity},
          ${thresholdValue},
          NOW()
        )
      `;
    }

    // 4. Reduce warehouse stock
    await db`
      UPDATE warehouse_products
      SET stock = stock - ${payload.quantity}
      WHERE warehouse_id = ${payload.warehouseID}
        AND product_id = ${product.id}
    `;

    // 5. Revalidate related pages
    revalidatePath(`/admin/warehouse/${payload.warehouseID}`);
    revalidatePath(`/admin/stores/${payload.storeID}`);

    return {
      success: true,
      message: `Transferred ${payload.quantity} units of ${payload.sku} to store ${payload.storeID}.`,
    };
  } catch (error: any) {
    console.error("transferProductToStore error:", error);
    throw new Error(error.message || "Failed to transfer product to store");
  }
}
