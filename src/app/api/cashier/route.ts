import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "cashier") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;

  try {
    const products = await db`
      SELECT
        ws.product_id,
        p.name AS product_name,
        ws.product_variants_id,
        pv.variant_name,
        ws.total_stock_amount
        FROM "user" AS cashier
        JOIN "user" AS admin ON cashier.admin_id = admin.id
        JOIN warehouse w ON w.company_id = c.id
        JOIN warehouse_stock ws ON ws.warehouse_id = w.id
        JOIN product p ON ws.product_id = p.id
        LEFT JOIN product_variant pv ON ws.product_variants_id = pv.id
        WHERE cashier.id = ${userID};
    `;
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products for cashier:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
