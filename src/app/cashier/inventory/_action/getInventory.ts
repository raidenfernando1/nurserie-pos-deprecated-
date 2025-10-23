"use server";
import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import type { Product } from "@/types/product";

export default async function fetchInventory() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { error: "Unauthorized", status: 401 };
    }
    const response = await db`
        SELECT
            si.inventory_id AS id,
            si.warehouse_id,
            w.warehouse_name,
            si.product_id,
            p.name,
            p.price,
            p.sku,
            p.barcode,
            p.image_url,
            p.brand,
            p.category,
            p.description,
            si.stock,
            si.threshold AS stock_threshold,
            si.created_at
        FROM store_inventory si
        JOIN warehouse w ON si.warehouse_id = w.id
        JOIN products p ON si.product_id = p.id
        WHERE si.store_id = 1
        ORDER BY p.name;
        `;
    return response as Product[];
  } catch (err) {
    console.error("Fetch Products error: ", err);
    return { error: "Failed to fetch products", status: 500 };
  }
}
