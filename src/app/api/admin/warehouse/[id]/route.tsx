// app/api/admin/warehouse/[id]/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  console.log("[WAREHOUSE DETAIL] Incoming request:", req.url, params);

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("[WAREHOUSE DETAIL] Session:", session);

    if (!session) {
      console.warn("[WAREHOUSE DETAIL] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;
    const warehouseID = params.id;

    console.log("[WAREHOUSE DETAIL] userID:", userID);
    console.log("[WAREHOUSE DETAIL] warehouseID:", warehouseID);

    // for fetching specific warehouse data
    const query = db`
      SELECT
        w.id AS warehouse_id,
        w.company_id,
        w.warehouse_name,
        ws.id AS warehouse_stock_id,
        ws.product_id,
        ws.product_variants_id
      FROM warehouse w
      JOIN company c ON w.company_id = c.id
      LEFT JOIN warehouse_stock ws ON ws.warehouse_id = w.id
      WHERE c.admin_id = ${userID}
        AND w.id = ${warehouseID}
      ORDER BY ws.id;
    `;

    console.log("[WAREHOUSE DETAIL] Running query:", query);

    const [warehouse] = await query;

    console.log("[WAREHOUSE DETAIL] Query result:", warehouse);

    if (!warehouse) {
      console.warn(
        "[WAREHOUSE DETAIL] Warehouse not found or unauthorized:",
        warehouseID,
      );
      return NextResponse.json(
        { error: "Warehouse not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(warehouse, { status: 200 });
  } catch (error: any) {
    console.error("[WAREHOUSE DETAIL] Error:", error.message, error.stack);

    return NextResponse.json(
      { error: "Server error while fetching warehouse" },
      { status: 500 },
    );
  }
}
