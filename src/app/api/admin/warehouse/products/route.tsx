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
  p.id,
  p.name,
  p.brand,
  p.category,
  p.image_url,
  wp.stock,
  wp.stock_threshold,
  p.price,
  p.sku,
  p.barcode,
  w.warehouse_name,
  c.company_name
FROM products p
JOIN warehouse_products wp ON wp.product_id = p.id
JOIN warehouse w ON wp.warehouse_id = w.id
JOIN company c ON w.company_id = c.id
JOIN "user" u ON c.admin_id = u.id
WHERE u.id = ${adminId};
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
