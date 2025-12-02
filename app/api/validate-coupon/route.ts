import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !subtotal) {
      return NextResponse.json(
        { ok: false, message: "Código o subtotal faltante." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (!coupon) {
      return NextResponse.json({ ok: false, message: "Cupón inválido." });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, message: "Cupón expirado." });
    }

    let discount = 0;

    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }

    return NextResponse.json({
      ok: true,
      discount,
      coupon: coupon.code,
      finalTotal: subtotal - discount,
    });
  } catch (err) {
    console.error("Error validando cupón: ", err);
    return NextResponse.json({ ok: false, message: "Error del servidor." });
  }
}
