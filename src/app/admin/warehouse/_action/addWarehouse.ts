"use server";
import { db } from "@/lib/db-client";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type Warehouse = {
  id: string;
  warehouse_name: string;
};

export default async function addWarehouse({ name }: { name: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { error: "Unauthorized", status: 401 };
    }

    if (!name || name.trim().length === 0) {
      return { error: "Warehouse name is required", status: 400 };
    }

    const existing = await db`
      SELECT id, warehouse_name 
      FROM warehouse 
      WHERE LOWER(warehouse_name) = LOWER(${name.trim()})
    `;

    if (existing.length > 0) {
      return {
        error: "Warehouse with this name already exists",
        status: 409,
      };
    }

    const response = await db`
      INSERT INTO warehouse (warehouse_name)
      VALUES (${name.trim()})
      RETURNING id, warehouse_name;
    `;

    revalidatePath("/admin/warehouse");

    return {
      success: true,
      warehouse: response[0] as Warehouse,
    };
  } catch (err) {
    console.error("addWarehouse error:", err);
    return { error: "Failed to add warehouse", status: 500 };
  }
}
