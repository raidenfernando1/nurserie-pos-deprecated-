import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

/*
THIS API IS FOR FETCHING ALL PRODUCTS TIED TO AN ADMIN USERID AND WAREHOUSEID 
ITS TIED TO
*/
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userID = session.user?.id;
    const warehouseID = parseInt((await params).id, 10);

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
          wp.stock_threshold,
          w.warehouse_name
      FROM warehouse_products wp
      JOIN products p ON wp.product_id = p.id
      JOIN warehouse w ON wp.warehouse_id = w.id
      JOIN company c ON w.company_id = c.id
      WHERE c.admin_id = ${userID}
      AND w.id = ${warehouseID}
    `;

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("[WAREHOUSE DETAIL] Error:", error.message);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
