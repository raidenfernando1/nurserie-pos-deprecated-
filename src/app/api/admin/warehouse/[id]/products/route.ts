import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

/**
 * GET /api/admin/warehouse/[id]/products
 * Fetch all products stored in a specific warehouse.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: warehouseID } = await context.params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await db`
      SELECT
          wp.id AS warehouse_product_id,
          p.id AS product_id,
          p.name,
          p.brand,
          p.category,
          p.sku,
          p.barcode,
          p.price,
          p.image_url,
          wp.stock,
          wp.stock_threshold,
          w.warehouse_name
      FROM warehouse_products wp
      JOIN products p ON wp.product_id = p.id
      JOIN warehouse w ON wp.warehouse_id = w.id
      WHERE w.id = ${warehouseID};
    `;

    return NextResponse.json(response);
  } catch (e) {
    console.error("GET /api/admin/warehouse/[id]/products error:", e);
    return NextResponse.json(
      { error: "Server error while fetching warehouse products" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/warehouse/[id]/products
 * Adds a product to a warehouse — either by linking an existing product or creating a new one.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: warehouseID } = await context.params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "link") {
      return await linkExistingProduct(body, warehouseID);
    }
    return await createNewProduct(body, warehouseID);
  } catch (error) {
    console.error("Error in product operation:", error);

    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "SKU or barcode already exists" },
          { status: 409 },
        );
      }
      if (error.message.includes("foreign key")) {
        return NextResponse.json(
          { error: "Invalid warehouse or product reference" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * linkExistingProduct()
 * Links an existing product to a specific warehouse and records the initial stock movement.
 */
async function linkExistingProduct(body: any, warehouseID: string) {
  const { product_id, stock, stock_threshold } = body;

  if (!product_id || stock === undefined || stock_threshold === undefined) {
    return NextResponse.json(
      {
        error: "Missing required fields: product_id, stock, stock_threshold",
      },
      { status: 400 },
    );
  }

  if (stock < 0 || stock_threshold < 0) {
    return NextResponse.json(
      { error: "Stock values cannot be negative" },
      { status: 400 },
    );
  }

  const result = await db`
    WITH wp AS (
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      VALUES (${warehouseID}, ${product_id}, ${stock}, ${stock_threshold})
      RETURNING id, warehouse_id, product_id, stock, stock_threshold
    )
    INSERT INTO stock_movements (warehouse_product_id, change, reason, date_added)
    SELECT
      wp.id,
      ${stock},
      'Initial stock for warehouse',
      NOW()
    FROM wp
    RETURNING
      warehouse_product_id,
      change,
      reason,
      date_added,
      (SELECT json_build_object(
        'id', wp.id,
        'warehouse_id', wp.warehouse_id,
        'product_id', wp.product_id,
        'stock', wp.stock,
        'stock_threshold', wp.stock_threshold
      ) FROM wp WHERE wp.id = warehouse_product_id) as warehouse_product
  `;

  if (!result || result.length === 0) {
    return NextResponse.json(
      {
        error:
          "Failed to link product. Product may not exist or is already linked.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Product successfully linked to warehouse",
      data: result[0],
    },
    { status: 201 },
  );
}

/**
 * createNewProduct()
 * Creates a new product and stores it directly in the specified warehouse.
 */
async function createNewProduct(body: any, warehouseID: string) {
  const {
    name,
    description,
    brand,
    category,
    sku,
    barcode,
    price,
    image_url,
    initial_stock,
    stock_threshold,
  } = body;

  if (
    !name ||
    !brand ||
    !category ||
    !sku ||
    price === undefined ||
    initial_stock === undefined ||
    stock_threshold === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (initial_stock < 0 || stock_threshold < 0 || price < 0) {
    return NextResponse.json(
      { error: "Stock values and price cannot be negative" },
      { status: 400 },
    );
  }

  const result = await db`
    WITH new_product AS (
      INSERT INTO products (
        name, description, brand, category, sku, barcode, price, image_url
      )
      VALUES (
        ${name},
        ${description || null},
        ${brand},
        ${category},
        ${sku},
        ${barcode || null},
        ${price},
        ${image_url || null}
      )
      RETURNING id, name, sku
    ),
    wp AS (
      INSERT INTO warehouse_products (
        warehouse_id, product_id, stock, stock_threshold
      )
      SELECT ${warehouseID}, np.id, ${initial_stock}, ${stock_threshold}
      FROM new_product np
      RETURNING id, product_id, stock
    )
    INSERT INTO stock_movements (
      warehouse_product_id, change, reason, date_added
    )
    SELECT wp.id, ${initial_stock}, 'Initial stock delivery', NOW()
    FROM wp
    RETURNING
      (SELECT json_build_object(
        'product_id', np.id,
        'name', np.name,
        'sku', np.sku,
        'initial_stock', wp.stock,
        'warehouse_product_id', wp.id
      ) FROM new_product np, wp WHERE wp.product_id = np.id) as product_info;
  `;

  if (!result || result.length === 0) {
    return NextResponse.json(
      { error: "Failed to create product or link it to warehouse" },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Product created successfully",
      data: result[0].product_info,
    },
    { status: 201 },
  );
}
