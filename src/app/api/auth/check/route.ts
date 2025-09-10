import { NextResponse } from "next/server";
import auth from "@/lib/auth-server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionEmail } = await req.json();

    if (sessionEmail === "fernandoraiden6@gmail.com") {
      return NextResponse.json({
        status: "success",
        verified: true,
      });
    } else {
      return NextResponse.json(
        {
          status: "failed",
          verified: false,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid request" },
      { status: 400 }
    );
  }
}
