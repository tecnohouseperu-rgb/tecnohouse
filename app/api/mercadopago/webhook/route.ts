// app/api/mercadopago/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendOrderEmail } from "@/utils/sendEmail";

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

    // Solo procesamos eventos de pago
    if (type === "payment" || action?.includes("payment")) {
      const paymentId = data?.id;
      if (!paymentId) {
        return NextResponse.json({ status: "no-payment-id" });
      }

      // 1️⃣ Consultamos el pago real en Mercado Pago
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

      const status = mpData.status as string | undefined; // approved | pending | rejected | ...
      const statusDetail = mpData.status_detail as string | undefined;
      const externalRef = mpData.external_reference as string | undefined;

      if (!externalRef) {
        console.warn("⚠️ Pago sin external_reference");
        return NextResponse.json({ status: "no-external-ref" });
      }

      // 2️⃣ Traemos la orden para obtener datos del cliente
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          id,
          nombres,
          telefono,
          email,
          direccion,
          distrito,
          provincia,
          departamento,
          referencia,
          total,
          email_sent
        `
        )
        .eq("id", externalRef)
        .maybeSingle();

      if (orderError) {
        console.error("❌ Error obteniendo order en Supabase:", orderError);
      }

      // 3️⃣ Traemos los ítems de la orden
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("name, size, qty, price")
        .eq("order_id", externalRef);

      if (itemsError) {
        console.error("⚠️ Error obteniendo items de la orden:", itemsError);
      }

      // 4️⃣ Actualizamos la orden con el estado de MP
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          mp_payment_id: String(paymentId),
          mp_payment_status: status ?? null,
          mp_payment_status_detail: statusDetail ?? null,
          mp_raw: mpData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", externalRef);

      if (updateError) {
        console.error("❌ Error actualizando order en Supabase:", updateError);
        return NextResponse.json(
          { status: "db-error" },
          { status: 500 }
        );
      }

      console.log(`🟢 Pedido ${externalRef} actualizado a: ${status}`);

      // 5️⃣ Si tenemos datos de la orden y aún no se envió email, mandamos correo
      if (
        order &&
        !order.email_sent &&
        (status === "approved" || status === "pending")
      ) {
        const emailStatus = status === "approved" ? "approved" : "pending";

        if (order.email && typeof order.total === "number") {
          await sendOrderEmail({
            to: order.email,
            status: emailStatus,
            orderId: String(order.id),
            amount: Number(order.total ?? 0),

            // Datos del cliente / envío
            customerName: order.nombres || undefined,
            shippingAddress: order.direccion || undefined,
            shippingDistrict: [order.distrito, order.provincia, order.departamento]
              .filter(Boolean)
              .join(" - ") || undefined,
            shippingReference: order.referencia || undefined,
            shippingPhone: order.telefono || undefined,

            // Lista de productos
            items:
              orderItems?.map((item) => ({
                name: item.name,
                size: item.size ?? undefined,
                quantity: item.qty,
                unitPrice: Number(item.price ?? 0),
              })) ?? [],
          });

          // Marcamos que ya se envió el correo
          const { error: emailFlagError } = await supabase
            .from("orders")
            .update({ email_sent: true })
            .eq("id", order.id);

          if (emailFlagError) {
            console.error(
              "⚠️ Error marcando email_sent en orden:",
              emailFlagError
            );
          } else {
            console.log(
              `📧 Email enviado y marcado para pedido ${order.id} (${emailStatus})`
            );
          }
        } else {
          console.warn(
            `⚠️ Orden ${order.id} sin email o total válido, no se envía correo`
          );
        }
      }

      return NextResponse.json({ status: "updated", orderId: externalRef });
    }

    // Otros tipos de evento: los ignoramos por ahora
    return NextResponse.json({ status: "ignored" });
  } catch (err) {
    console.error("❌ Error en webhook MP:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
