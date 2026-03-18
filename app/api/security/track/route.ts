import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getIp(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown"
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const body = await req.json();
    const userAgent = req.headers.get("user-agent") || "";

    await supabase.from("security_visitors").insert({
      ip,
      fingerprint_hash: body.fingerprint_hash,
      ban_token_hash: body.ban_token_hash,
      user_agent: userAgent,
      path: body.path,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}