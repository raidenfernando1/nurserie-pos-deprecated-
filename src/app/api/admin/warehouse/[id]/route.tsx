// app/api/admin/warehouse/[id]/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;
    const warehouseID = parseInt(params.id, 10);

    const products = await db`
      SELECT 
        p.id,
        p.name,
        p.brand,
        p.category,
        p.stock,
        p.stock_threshold,
        p.price,
        p.sku,
        p.barcode
      FROM products p
      JOIN warehouse w ON p.warehouse_id = w.id
      JOIN company c ON w.company_id = c.id
      WHERE w.id = ${warehouseID}
        AND c.admin_id = ${userID};
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Warehouse not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("[WAREHOUSE DETAIL] Error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Server error while fetching warehouse" },
      { status: 500 }
    );
  }
}
