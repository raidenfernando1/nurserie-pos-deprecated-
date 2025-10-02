import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

/**
 * GET /api/admin/warehouse/[id]/products
 * ---------------------------------------
 * Fetches all products stored in a specific warehouse owned by the authenticated admin.
 * Requires:
 *  - Authenticated session
 *  - Warehouse ID as a dynamic route param
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: warehouseID } = await context.params; // 👈 await is required now

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;
  try {
    // ✅ Query all products that belong to this warehouse owned by the logged-in admin
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
      JOIN company c ON w.company_id = c.id
      WHERE c.admin_id = ${userID}
        AND w.id = ${warehouseID};
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
 * ---------------------------------------
 * Adds a product into a warehouse.
 * Two modes:
 *  1. Link an existing product to the warehouse (`action: "link"`)
 *  2. Create a new product and immediately store it in the warehouse (default)
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: warehouseID } = await context.params;
  const session = await auth.api.getSession({ headers: await headers() });

  // Must be authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminID = session.user.id;

  try {
    const body = await request.json();
    const { action } = body;

    // If client specifies `link`, try linking an existing product
    if (action === "link") {
      return await linkExistingProduct(body, warehouseID, adminID);
    }

    // Otherwise, create a completely new product
    return await createNewProduct(body, warehouseID, adminID);
  } catch (error) {
    console.error("Error in product operation:", error);

    // Specific database error handling
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "SKU or barcode already exists" },
          { status: 409 },
        );
      }
      if (error.message.includes("foreign key")) {
        return NextResponse.json(
          { error: "Invalid warehouse or company reference" },
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
 * ----------------------
 * Links an existing product to a specific warehouse and records the initial stock movement.
 * Steps:
 *  1. Verify that the admin owns the warehouse and the product belongs to their company.
 *  2. Insert a record into `warehouse_products`.
 *  3. Log the initial stock insertion into `stock_movements`.
 */
async function linkExistingProduct(
  body: any,
  warehouseID: string,
  adminID: string,
) {
  const { product_id, stock, stock_threshold } = body;

  // Validate required fields
  if (!product_id || stock === undefined || stock_threshold === undefined) {
    return NextResponse.json(
      {
        error: "Missing required fields: product_id, stock, stock_threshold",
      },
      { status: 400 },
    );
  }

  // Prevent negative stock values
  if (stock < 0 || stock_threshold < 0) {
    return NextResponse.json(
      { error: "Stock values cannot be negative" },
      { status: 400 },
    );
  }

  // ✅ Verify ownership and link product to warehouse
  const result = await db`
    WITH admin_check AS (
      SELECT
        w.id as warehouse_id,
        c.id as company_id
      FROM warehouse w
      JOIN company c ON w.company_id = c.id
      WHERE w.id = ${warehouseID}
        AND c.admin_id = ${adminID}
    ),
    product_check AS (
      SELECT p.id
      FROM products p, admin_check ac
      WHERE p.id = ${product_id}
        AND p.company_id = ac.company_id
    ),
    wp AS (
      INSERT INTO warehouse_products (warehouse_id, product_id, stock, stock_threshold)
      SELECT
        ${warehouseID},
        pc.id,
        ${stock},
        ${stock_threshold}
      FROM product_check pc, admin_check ac
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
          "Failed to link product. Product may not exist, already be linked, or you don't have permission.",
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
 * -------------------
 * Creates a new product under the admin's company and stores it directly in the specified warehouse.
 * Steps:
 *  1. Validate all input fields.
 *  2. Confirm the admin owns the warehouse.
 *  3. Insert product into `products` table.
 *  4. Insert stock entry into `warehouse_products`.
 *  5. Log initial stock movement in `stock_movements`.
 */
async function createNewProduct(
  body: any,
  warehouseID: string,
  adminID: string,
) {
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

  // ✅ Validate input
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

  // ✅ Create product, link it to warehouse, and log stock movement in one query
  const result = await db`
    WITH admin_check AS (
      SELECT c.id as company_id, c.admin_id
      FROM company c
      JOIN warehouse w ON c.id = w.company_id
      WHERE w.id = ${warehouseID} AND c.admin_id = ${adminID}
    ),
    new_product AS (
      INSERT INTO products (
        company_id, name, description, brand, category, sku, barcode, price, image_url
      )
      SELECT
        ac.company_id,
        ${name},
        ${description || null},
        ${brand},
        ${category},
        ${sku},
        ${barcode || null},
        ${price},
        ${image_url || null}
      FROM admin_check ac
      RETURNING id, name, sku
    ),
    wp AS (
      INSERT INTO warehouse_products (
        warehouse_id, product_id, stock, stock_threshold
      )
      SELECT ${warehouseID}, np.id, ${initial_stock}, ${stock_threshold}
      FROM new_product np, admin_check ac
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
      {
        error: "Failed to create product or unauthorized access to warehouse",
      },
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
