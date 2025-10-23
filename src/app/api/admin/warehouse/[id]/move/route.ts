import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";
import { db } from "@/lib/db-client";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.text();

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      console.error("❌ Failed to parse JSON body:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
      warehouseID,
      to_warehouseID,
      productID,
      send_stock,
      stock_threshold,
    } = parsed;

    console.log("📦 Parsed data:", {
      warehouseID,
      to_warehouseID,
      productID,
      send_stock,
      stock_threshold,
    });

    // --- Validate
    if (
      !warehouseID ||
      !to_warehouseID ||
      !productID ||
      !send_stock ||
      !stock_threshold
    ) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // --- Auth check
    let session;
    try {
      session = await auth.api.getSession({ headers: await headers() });
      console.log("👤 Session:", session ? session.user : "No session");
    } catch (err) {
      console.error("❌ Auth error:", err);
      return NextResponse.json({ error: "Auth failed" }, { status: 401 });
    }

    if (!session || session.user.role !== "admin") {
      console.warn("🚫 Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Check source warehouse stock
    console.log("🔍 Checking stock for warehouse:", warehouseID);
    const [source] = await db`
      SELECT stock FROM warehouse_products
      WHERE warehouse_id = ${warehouseID} AND product_id = ${productID}
    `;
    console.log("📊 Source warehouse result:", source);

    if (!source) {
      console.warn("⚠️ Source warehouse or product not found");
      return NextResponse.json(
        { error: "Product not found in source warehouse" },
        { status: 404 },
      );
    }

    if (source.stock < send_stock) {
      console.warn("⚠️ Insufficient stock:", {
        available: source.stock,
        requested: send_stock,
      });
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    // --- Deduct from source warehouse
    console.log("🧾 Deducting stock from source:", {
      warehouseID,
      productID,
      send_stock,
    });
    const deductResult = await db`
      UPDATE warehouse_products
      SET stock = stock - ${send_stock}
      WHERE warehouse_id = ${warehouseID} AND product_id = ${productID}
      RETURNING stock
    `;
    console.log("✅ Deduct result:", deductResult);

    // --- Add to destination warehouse
    console.log("➕ Adding to destination warehouse:", {
      to_warehouseID,
      productID,
      send_stock,
      stock_threshold,
    });
    const addResult = await db`
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      VALUES (${to_warehouseID}, ${productID}, ${send_stock}, ${stock_threshold})
      ON CONFLICT (warehouse_id, product_id)
      DO UPDATE SET
        stock = warehouse_products.stock + EXCLUDED.stock,
        stock_threshold = EXCLUDED.stock_threshold
      RETURNING stock
    `;
    console.log("✅ Insert/Update result:", addResult);

    console.log("🎉 Transfer successful!");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.error("💥 Fatal error in API:", e);
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
