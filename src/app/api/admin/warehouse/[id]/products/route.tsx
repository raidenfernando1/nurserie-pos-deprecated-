// app/api/admin/warehouse/[id]/products/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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
        ws.product_id,
        p.name AS product_name,
        SUM(ws.total_stock_amount) AS total_stock_in_warehouse
      FROM warehouse_stock ws
      JOIN product p ON ws.product_id = p.id
      JOIN warehouse w ON ws.warehouse_id = w.id
      JOIN company c ON w.company_id = c.id
      WHERE ws.warehouse_id = ${warehouseID}
        AND c.admin_id = ${userID}
      GROUP BY ws.product_id, p.name;
    `;

    return NextResponse.json(response);
  } catch (e) {
    console.error("GET /api/admin/warehouse/[id]/products error:", e);

    return NextResponse.json(
      { error: "Server error while fetching warehouse products" },
      { status: 500 }
    );
  }
}
