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
