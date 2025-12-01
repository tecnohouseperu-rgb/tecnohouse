import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "undefined",
    accessToken: process.env.MP_ACCESS_TOKEN ? "OK" : "MISSING",
  });
}
