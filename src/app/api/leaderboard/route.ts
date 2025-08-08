import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization") || "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scores/top`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
