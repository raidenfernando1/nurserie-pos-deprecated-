/**
 * GET /api/admin/warehouse/[id]/products
 * Fetch warehouse details and all products stored in it.
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: warehouseID } = await context.params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [warehouse] = await db`
      SELECT 
        id,
        warehouse_name
      FROM warehouse
      WHERE id = ${warehouseID};
    `;

    if (!warehouse) {
      return NextResponse.json(
        { error: "Warehouse not found" },
        { status: 404 }
      );
    }

    const products = await db`
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

    return NextResponse.json({
      warehouse,
      products,
    });
  } catch (e) {
    console.error("GET /api/admin/warehouse/[id]/products error:", e);
    return NextResponse.json(
      { error: "Server error while fetching warehouse products" },
      { status: 500 }
    );
  }
}
