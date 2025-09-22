// File: /app/api/admin/warehouse/products/route.ts
import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.id;

    const response = await db`
      SELECT
        w.id AS warehouse_id,
        w.warehouse_name,
        p.id AS product_id,
        p.name AS product_name,
        p.category,
        p.img_url,
        pv.id AS variant_id,
        pv.variant_name,
        pv.variant_stock_threshold,
        pv.variant_price,
        pv.variant_sku
      FROM warehouse_stock ws
      JOIN warehouse w ON ws.warehouse_id = w.id
      JOIN product_variant pv ON ws.product_variants_id = pv.id
      JOIN product p ON pv.product_id = p.id
      JOIN company c ON w.company_id = c.id
      WHERE c.admin_id = 'DQ6QE041xsIVa8g7GPXeTTgZkp81l6cH'
      ORDER BY w.id, p.id, pv.id;
    `;

    if (response.length === 0) {
      return NextResponse.json(
        { message: "No products found in any warehouses" },
        { status: 404 },
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
