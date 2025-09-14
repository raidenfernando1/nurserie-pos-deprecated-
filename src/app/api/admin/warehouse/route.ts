import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

// FOR FETCHING ALL WAREHOUSE THAT IS CONNECTED TO THE ADMIN
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = session.user.id;
    console.log(userID);

    const response = await db`
  SELECT 
    w.id,
    w.company_id,
    w.warehouse_name,
    COALESCE(SUM(ws.total_stock_amount), 0) AS total_stock
  FROM warehouse w
  JOIN company c ON w.company_id = c.id
  LEFT JOIN warehouse_stock ws ON ws.warehouse_id = w.id
  WHERE c.admin_id = ${userID}
  GROUP BY w.id, w.company_id, w.warehouse_name
  ORDER BY w.id;
`;

    if (response.length === 0) {
      return NextResponse.json(
        { message: "No warehouses found for this admin" },
        { status: 404 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching warehouses:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// FOR FETCHING SPECIFIC WAREHOUSE
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;

  try {
    const body = await req.json();
    console.log("POST body:", body);
    const { warehouseID } = body;

    if (!warehouseID) {
      return NextResponse.json({
        error: "Error body is empty",
        status: 500,
      });
    }

    const response = await db`SELECT 
    ws.product_id,
    p.name AS product_name,
    SUM(ws.total_stock_amount) AS total_stock_in_warehouse
FROM warehouse_stock ws
JOIN product p ON ws.product_id = p.id
JOIN warehouse w ON ws.warehouse_id = w.id
JOIN company c ON w.company_id = c.id
WHERE ws.warehouse_id = ${warehouseID}
  AND c.admin_id =  ${userID}
GROUP BY ws.product_id, p.name;
`;

    if (!response) {
      return NextResponse.json({
        error: "Warehouse not found or unauthorized",
        status: 500,
      });
    }

    return NextResponse.json(response);
  } catch (e) {
    console.error("POST /api/admin/warehouse error:", e);
    return NextResponse.json(
      { error: "Invalid body or server error", status: 500 },
      { status: 500 }
    );
  }
}
