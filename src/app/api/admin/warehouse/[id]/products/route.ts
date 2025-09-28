import { NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";
import { db } from "@/lib/db-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userID = session.user.id;
  const warehouseID = await params.id;

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminID = session.user.id;
  const warehouseID = await params.id;

  try {
    const body = await request.json();

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
  } catch (error) {
    console.error("Error creating product:", error);

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
