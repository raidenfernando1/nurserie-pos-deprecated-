import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: NextRequest,
  { params }: { params: { sku: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sku } = params;

  try {
    const product = await db`
      SELECT
        id,
        name,
        description,
        brand,
        category,
        sku,
        barcode,
        price,
        image_url
      FROM products
      WHERE sku = ${sku}
      LIMIT 1
    `;

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product[0], { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sku: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sku = params.sku;
  const { searchParams } = new URL(req.url);
  const isGlobal = searchParams.has("isGlobal");
  const warehouseId = searchParams.get("warehouseId");

  if (!sku)
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });

  try {
    const product = await db`SELECT id FROM products WHERE sku = ${sku}`;
    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productId = product[0].id;

    if (isGlobal) {
      await db`DELETE FROM products WHERE sku = ${sku}`;
      return NextResponse.json(
        { message: "Product deleted globally" },
        { status: 200 },
      );
    }

    if (!warehouseId) {
      return NextResponse.json(
        { error: "warehouseId is required for scoped delete" },
        { status: 400 },
      );
    }

    await db`
      DELETE FROM warehouse_products
      WHERE product_id = ${productId} AND warehouse_id = ${warehouseId}
    `;

    return NextResponse.json(
      { message: "Product removed from warehouse" },
      { status: 200 },
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { sku: string } },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userID = session.user.id;
    if (!userID) {
      return NextResponse.json(
        { error: "Unauthorized - User ID required" },
        { status: 401 },
      );
    }

    const sku = params.sku; // Get SKU from URL params
    const body = await request.json();
    const { name, description, brand, category, price, image_url } = body;

    const result = await db`
      UPDATE products p
      SET
          name = COALESCE(${name}, p.name),
          description = COALESCE(${description}, p.description),
          brand = COALESCE(${brand}, p.brand),
          category = COALESCE(${category}, p.category),
          price = COALESCE(${price}, p.price),
          image_url = COALESCE(${image_url}, p.image_url)
      WHERE p.sku = ${sku}
      RETURNING p.*;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: result[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
