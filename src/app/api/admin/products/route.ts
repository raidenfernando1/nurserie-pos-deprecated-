import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { searchParams } = new URL(req.url);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const full = searchParams.get("full") === "true";

  try {
    const response = full
      ? await db`
          SELECT
            p.id,
            p.name,
            p.brand,
            p.category,
            p.image_url,
            COALESCE(wp.stock, 0) AS stock,
            COALESCE(wp.stock_threshold, 0) AS stock_threshold,
            p.price,
            p.sku,
            p.barcode,
            COALESCE(w.warehouse_name, 'No Warehouse') AS warehouse_name
          FROM products p
          LEFT JOIN warehouse_products wp ON wp.product_id = p.id
          LEFT JOIN warehouse w ON wp.warehouse_id = w.id;
        `
      : await db`
          SELECT
            p.id,
            p.name,
            p.sku,
            p.category
          FROM products p;
        `;

    if (response.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
