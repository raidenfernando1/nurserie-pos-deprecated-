"use server";

import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

import type { Warehouse } from "@/types/warehouse";

export default async function fetchWarehouses() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { error: "Unauthorized", status: 401 };
    }

    const response = await db`
        SELECT
          w.id AS warehouse_id,
          w.warehouse_name,
          COALESCE(COUNT(wp.id), 0) AS total_products,
          COALESCE(SUM(wp.stock), 0) AS total_stock,
          COALESCE(SUM(CASE WHEN wp.stock > 0 THEN 1 ELSE 0 END), 0) AS products_in_stock,
          COALESCE(SUM(CASE WHEN wp.stock < wp.stock_threshold AND wp.stock > 0 THEN 1 ELSE 0 END), 0) AS low_stock_products,
          COALESCE(SUM(CASE WHEN wp.stock = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock_products
        FROM warehouse w
        LEFT JOIN warehouse_products wp ON w.id = wp.warehouse_id
        GROUP BY w.id, w.warehouse_name
        ORDER BY w.warehouse_name;
  `;

    return response as Warehouse[];
  } catch (err) {
    console.error("fetchProducts error:", err);
    return { error: "Failed to fetch products", status: 500 };
  }
}
