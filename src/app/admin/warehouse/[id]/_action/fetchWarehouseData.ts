// fetchWarehouseData.ts
"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

interface WarehouseProduct {
  warehouse_product_id: string;
  product_id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  price: number;
  image_url: string;
  stock: number;
  stock_threshold: number;
}

interface WarehouseWithProducts {
  warehouse: {
    id: string;
    warehouse_name: string;
  };
  products: WarehouseProduct[];
}

export async function getWarehouseWithProducts(
  warehouseID: string,
): Promise<WarehouseWithProducts> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const warehouseResult = await db`
      SELECT
        id,
        warehouse_name
      FROM warehouse
      WHERE id = ${warehouseID};
    `;

    const warehouse = warehouseResult[0] as
      | { id: string; warehouse_name: string }
      | undefined;

    if (!warehouse) {
      throw new Error("Warehouse not found");
    }

    const productsResult = await db`
      SELECT
        wp.id AS warehouse_product_id,
        p.id AS product_id,
        p.name,
        p.brand,
        p.category,
        p.sku,
        p.barcode,
        p.price,
        p.image_url,
        wp.stock,
        wp.stock_threshold
      FROM warehouse_products wp
      JOIN products p ON wp.product_id = p.id
      WHERE wp.warehouse_id = ${warehouseID};
    `;

    const products = (productsResult as WarehouseProduct[]) || [];

    return { warehouse, products };
  } catch (e) {
    console.error("getWarehouseWithProducts error:", e);
    throw new Error("Server error while fetching warehouse products");
  }
}
