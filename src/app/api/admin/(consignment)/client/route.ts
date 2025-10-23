import { db } from "@/lib/db-client";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get("search");

  try {
    let response;

    if (uuid) {
      response = await db`
        SELECT 
          id AS client_id,
          name AS client_name,
          code_name,
          date_added,
          serial_key
        FROM clients
        WHERE serial_key = ${uuid};
      `;
    } else {
      response = await db`
        SELECT 
          id AS client_id,
          name AS client_name,
          code_name,
          date_added,
          serial_key
        FROM clients
        ORDER BY date_added DESC;
      `;
    }

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to fetch client(s)",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    console.log("🔍 DELETE handler triggered");

    // ✅ 1. Authenticate
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("🪪 Session:", session ? "Present" : "None");

    if (!session || session.user.role !== "admin") {
      console.warn("🚫 Unauthorized attempt to delete consignment");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Read serial_key from query param
    const { searchParams } = new URL(req.url);
    const serial_key = searchParams.get("serial_key");

    console.log("🔑 Raw request URL:", req.url);
    console.log("🔑 Extracted serial_key:", serial_key);

    if (!serial_key) {
      console.error("❌ No serial_key provided in query params");
      return NextResponse.json(
        { error: "Missing serial_key query parameter" },
        { status: 400 }
      );
    }

    // ✅ 3. Execute deletion query
    console.log("🗑️ Attempting deletion from clients table...");
    const result = await db`
      DELETE FROM clients
      WHERE serial_key = ${serial_key}
      RETURNING *;
    `;
    console.log("📦 DB deletion result:", result);

    // ✅ 4. Check result
    if (result.length === 0) {
      console.warn(
        `⚠️ No client found with serial_key: ${serial_key} — deletion skipped.`
      );
      return NextResponse.json(
        { error: "Consignment not found", serial_key },
        { status: 404 }
      );
    }

    // ✅ 5. Respond with confirmation
    console.log(
      `✅ Successfully deleted consignment: ${JSON.stringify(result[0])}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Consignment deleted successfully",
        deleted: result[0],
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("💥 DELETE ERROR:", e);
    return NextResponse.json(
      {
        error: "Failed to delete consignment",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, code_name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await db`
      INSERT INTO clients (name, code_name)
      VALUES (${name.trim()}, ${code_name || null})
      RETURNING *;
    `;

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Client created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);

    return NextResponse.json(
      {
        error: "Failed to create client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    // ✅ 1. Auth check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Parse request body
    const body = await req.json();
    const { serial_key, name, code_name } = body;

    if (!serial_key || !serial_key.trim()) {
      return NextResponse.json(
        { error: "serial_key is required" },
        { status: 400 }
      );
    }

    // Check if at least one field has a non-empty value
    const hasName = name && name.trim();
    const hasCodeName = code_name && code_name.trim();

    if (!hasName && !hasCodeName) {
      return NextResponse.json(
        { error: "At least one field (name or code_name) must be provided" },
        { status: 400 }
      );
    }

    // ✅ 3. Perform update using serial_key
    const result = await db`
      UPDATE clients
      SET
        name = COALESCE(${hasName ? name.trim() : null}, name),
        code_name = COALESCE(${
          hasCodeName ? code_name.trim() : null
        }, code_name)
      WHERE serial_key = ${serial_key.trim()}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // ✅ 4. Return updated record
    return NextResponse.json(
      {
        success: true,
        message: "Client updated successfully",
        data: result[0],
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("PATCH ERROR:", e);
    return NextResponse.json(
      {
        error: "Failed to update client",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
