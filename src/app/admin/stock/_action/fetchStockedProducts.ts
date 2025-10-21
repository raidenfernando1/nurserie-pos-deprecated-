"use server";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";

const getWarehouseProducts = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const products = await db`
      SELECT wp.id, wp.warehouse_id, wp.product_id, wp.stock, wp.stock_threshold,
             w.warehouse_name, p.name AS product_name, p.category, p.sku,
             p.barcode, p.price, p.image_url
      FROM warehouse_products wp
      JOIN warehouse w ON wp.warehouse_id = w.id
      JOIN products p ON wp.product_id = p.id
    `;

    console.log(products);
    return products;
  } catch (error) {
    console.error("Error fetching warehouse products:", error);
    throw new Error("Failed to fetch warehouse products");
  }
};

export default getWarehouseProducts;
