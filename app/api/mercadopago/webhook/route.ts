// app/api/mercadopago/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  // Para probar rápido desde el navegador:
  // https://tecnohouseperu.com/api/mercadopago/webhook
  return NextResponse.json({ ok: true, message: "Webhook OK" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📦 Webhook recibido:", JSON.stringify(body, null, 2));

    const { type, action, data } = body;

    const supabase = createClient();

    // Solo procesamos pagos
    if (type === "payment" || action?.includes("payment")) {
      const paymentId = data?.id;
      if (!paymentId) {
        return NextResponse.json({ status: "no-payment-id" });
      }

      // Consultamos el pago real en Mercado Pago
      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}`,
          },
        }
      );

      if (!mpRes.ok) {
        console.error("❌ Error consultando pago MP:", await mpRes.text());
        return NextResponse.json(
          { status: "mp-error" },
          { status: 500 }
        );
      }

      const mpData = await mpRes.json();

      console.log("💰 Datos del pago:", JSON.stringify(mpData, null, 2));

      const status = mpData.status as string | undefined;
      const externalRef = mpData.external_reference as string | undefined;

      if (!externalRef) {
        console.warn("⚠️ Pago sin external_reference");
        return NextResponse.json({ status: "no-external-ref" });
      }

      // Actualizamos la orden en Supabase
      const { error } = await supabase
        .from("orders")
        .update({
          mp_status: status ?? null,
          mp_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", externalRef);

      if (error) {
        console.error("❌ Error actualizando order en Supabase:", error);
        return NextResponse.json(
          { status: "db-error" },
          { status: 500 }
        );
      }

      console.log(`🟢 Pedido ${externalRef} actualizado a: ${status}`);

      return NextResponse.json({ status: "updated", orderId: externalRef });
    }

    // Otros tipos de evento: los ignoramos por ahora
    return NextResponse.json({ status: "ignored" });
  } catch (err) {
    console.error("❌ Error en webhook MP:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
