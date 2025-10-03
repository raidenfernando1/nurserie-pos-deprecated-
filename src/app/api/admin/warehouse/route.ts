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

    // No need for userID anymore if there's no filtering
    const response = await db`
      WITH warehouse_stats AS (
        SELECT
          w.id AS warehouse_id,
          w.warehouse_name,
          COALESCE(SUM(wp.stock), 0) AS total_stock,
          COUNT(DISTINCT wp.product_id) AS total_products
        FROM warehouse w
        LEFT JOIN warehouse_products wp ON w.id = wp.warehouse_id
        GROUP BY w.id, w.warehouse_name
      )
      SELECT *,
            (SELECT SUM(total_stock) FROM warehouse_stats) AS company_total_stock,
            (SELECT SUM(total_products) FROM warehouse_stats) AS company_total_products
      FROM warehouse_stats
      ORDER BY warehouse_id;
    `;

    const warehouses = response.map((row) => ({
      warehouse_id: parseInt(row.warehouse_id),
      warehouse_name: row.warehouse_name,
      total_stock: parseInt(row.total_stock),
      total_products: parseInt(row.total_products),
    }));

    const stock = {
      company_total_stock: parseInt(response[0]?.company_total_stock || 0),
      company_total_products: parseInt(
        response[0]?.company_total_products || 0,
      ),
    };

    return NextResponse.json({
      success: true,
      stock,
      warehouses,
    });
  } catch (error: any) {
    console.error("Error fetching warehouses:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
