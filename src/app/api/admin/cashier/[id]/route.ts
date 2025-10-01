import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-client";
import { headers } from "next/headers";
import auth from "@/lib/auth-server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminID = session.user.id;
    const { id: cashierID } = await context.params; // ✅ must `await` it now

    if (!cashierID) {
      return NextResponse.json(
        { error: "Cashier id is required" },
        { status: 400 },
      );
    }

    const result = await db`
      DELETE FROM "user"
      WHERE id = ${cashierID}
        AND admin_id = ${adminID}
        AND role = 'cashier'
      RETURNING id, name
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cashier not found or not authorized" },
        { status: 404 },
      );
    }

    console.log(`Cashier ${cashierID} deleted by admin ${adminID}`);

    return NextResponse.json(
      {
        success: true,
        message: "Cashier deleted successfully",
        deletedCashier: result[0],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(">>> Error in DELETE /api/admin/cashier/[id]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete cashier",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
