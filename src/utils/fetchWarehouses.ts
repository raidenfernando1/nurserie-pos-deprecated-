"use server";

import { db } from "@/lib/db-client";

export async function getWarehouses(): Promise<any[]> {
  const rows = await db`
    SELECT 
      id AS warehouse_id,
      company_id,
      warehouse_name,
      total_stock,
      total_products
    FROM warehouse
    ORDER BY id;
  `;

  return rows;
}
