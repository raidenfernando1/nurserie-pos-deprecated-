import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

/*
FOR FETCHING ALL COMPANY WIDE PRODUCTS ALL WAREHOUSES AND ETC
*/
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.id;

    const response = await db`
SELECT
  p.id,
  p.name,
  p.brand,
  p.category,
  p.image_url,
  COALESCE(wp.stock, 0) as stock,
  COALESCE(wp.stock_threshold, 0) as stock_threshold,
  p.price,
  p.sku,
  p.barcode,
  COALESCE(w.warehouse_name, 'No Warehouse') as warehouse_name,
  c.company_name
FROM products p
JOIN company c ON p.company_id = c.id
JOIN "user" u ON c.admin_id = u.id
LEFT JOIN warehouse_products wp ON wp.product_id = p.id
LEFT JOIN warehouse w ON wp.warehouse_id = w.id
WHERE u.id = ${adminId};
    `;

    if (response.length === 0) {
      return NextResponse.json(
        { message: "No products found in any warehouses" },
        { status: 404 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
