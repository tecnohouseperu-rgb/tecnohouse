import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !service) throw new Error("Missing Supabase env vars");
  return createClient(url, service, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ext = String(body?.external_reference || "").trim();

    if (!ext) {
      return NextResponse.json({ ok: true, skipped: true, reason: "no_external_reference" });
    }

    const sb = supabaseAdmin();

    // Campos "seguros" (no dependen de enums)
    const patch = {
      gateway: "socio",
      mp_payment_status: "pending",
      mp_payment_status_detail: "SOCIO_SUBMITTED",
    };

    // 1) Si ext es numérico → matchea orders.id
    const maybeId = Number(ext);
    if (Number.isFinite(maybeId) && String(maybeId) === ext) {
      const { error, data } = await sb
        .from("orders")
        .update(patch)
        .eq("id", maybeId)
        .select("id")
        .maybeSingle();

      if (error) {
        // No romper flujo
        return NextResponse.json({ ok: true, skipped: true, reason: "update_by_id_failed", detail: error.message });
      }

      if (data?.id) return NextResponse.json({ ok: true, matched: "id", id: data.id });

      // Si no encontró por id, continúa a intentar por preference_id
    }

    // 2) Intentar por mp_preference_id (existe en tu tabla)
    const { error: e2, data: d2 } = await sb
      .from("orders")
      .update(patch)
      .eq("mp_preference_id", ext)
      .select("id")
      .maybeSingle();

    if (e2) {
      return NextResponse.json({ ok: true, skipped: true, reason: "update_by_preference_failed", detail: e2.message });
    }

    if (d2?.id) return NextResponse.json({ ok: true, matched: "mp_preference_id", id: d2.id });

    // 3) No match → no romper
    return NextResponse.json({ ok: true, skipped: true, reason: "not_found" });
  } catch (err: any) {
    // Nunca romper el checkout/form
    return NextResponse.json({ ok: true, skipped: true, reason: "exception", detail: err?.message || "error" });
  }
}