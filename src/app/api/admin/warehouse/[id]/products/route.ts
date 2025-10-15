import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: warehouseID } = await context.params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await db`
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
          wp.stock_threshold,
          w.warehouse_name
      FROM warehouse_products wp
      JOIN products p ON wp.product_id = p.id
      JOIN warehouse w ON wp.warehouse_id = w.id
      WHERE w.id = ${warehouseID};
    `;

    return NextResponse.json(response);
  } catch (e) {
    console.error("GET /api/admin/warehouse/[id]/products error:", e);
    return NextResponse.json(
      { error: "Server error while fetching warehouse products" },
      { status: 500 },
    );
  }
}
