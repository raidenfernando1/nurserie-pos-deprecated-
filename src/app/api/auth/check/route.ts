import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "raiden",
    message: "woo",
  });
}

export async function POST(req: Request) {
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
