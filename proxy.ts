import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function sha256(value: string) {
  const enc = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function proxy(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    const rawToken = req.cookies.get("th_device_token")?.value || null;
    const banTokenHash = rawToken ? await sha256(rawToken) : null;

    const conditions = [
      ip && ip !== "unknown" ? `ip.eq.${ip}` : null,
      banTokenHash ? `ban_token_hash.eq.${banTokenHash}` : null,
    ].filter(Boolean);

    if (conditions.length > 0) {
      const { data: banned, error } = await supabase
        .from("security_bans")
        .select("id")
        .eq("active", true)
        .or(conditions.join(","))
        .limit(1);

      if (!error && banned && banned.length > 0) {
        return new NextResponse("Acceso restringido", { status: 403 });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("proxy security error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};