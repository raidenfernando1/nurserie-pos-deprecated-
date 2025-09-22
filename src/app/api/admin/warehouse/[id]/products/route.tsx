// app/api/admin/warehouse/[id]/products/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;
  const warehouseID = params.id;

  try {
    const response = await db`
      SELECT
          w.id AS warehouse_id,
          w.warehouse_name,
          p.id AS product_id,
          p.name AS product_name,
          p.brand,
          p.barcode,
          p.img_url,
          p.sku,
          pv.id AS variant_id,
          pv.variant_name,
          pv.variant_stock,
          pv.variant_stock_threshold,
          pv.variant_price,
          pv.variant_sku
      FROM warehouse_stock ws
      JOIN warehouse w ON ws.warehouse_id = w.id
      JOIN product_variant pv ON ws.product_variants_id = pv.id
      JOIN product p ON pv.product_id = p.id
      JOIN company c ON w.company_id = c.id
      WHERE ws.warehouse_id = ${warehouseID}
        AND c.admin_id = ${userID}
      ORDER BY p.id, pv.id;
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
