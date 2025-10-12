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
            p.price,
            p.sku,
            p.barcode
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

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
      console.warn("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      description,
      brand = "none",
      category,
      sku,
      barcode,
      price = 0,
      image_url = "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png",
    } = body;

    if (!name || !sku || !barcode) {
      console.warn("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: name, sku, or barcode" },
        { status: 400 },
      );
    }

    const finalImageUrl =
      image_url?.trim() ||
      "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png";

    const insertedProduct = await db`
      INSERT INTO products (
        name,
        description,
        brand,
        category,
        sku,
        barcode,
        price,
        image_url
      ) VALUES (
        ${name},
        ${description},
        ${brand},
        ${category},
        ${sku},
        ${barcode},
        ${price},
        ${finalImageUrl}
      ) RETURNING *;
    `;
    return NextResponse.json({ product: insertedProduct }, { status: 201 });
  } catch (e: any) {
    console.error("Error inserting product:", e);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
