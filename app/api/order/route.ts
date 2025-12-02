// /api/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      receiptType,
      nombres,
      docType,
      docNumber,
      ruc,
      razonSocial,
      direccionFiscal,
      telefono,
      email,
      departamento,
      provincia,
      distrito,
      direccion,
      referencia,
      subtotal,
      envio,
      discount,
      total,
      finalTotal,
      carrier,
      shippingMode,
      gateway,
      appliedCoupon,
      cart,
    } = body;

    const supabase = createClient();

    // 1) Insertar pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        receipt_type: receiptType,
        nombres,
        doc_type: docType,
        doc_number: docNumber,
        ruc,
        razon_social: razonSocial,
        direccion_fiscal: direccionFiscal,
        telefono,
        email,
        departamento,
        provincia,
        distrito,
        direccion,
        referencia,
        subtotal,
        envio,

        // 👇 CUPÓN — SOLO UNA VEZ
        coupon_code: appliedCoupon ?? null,
        discount: discount ?? 0,

        // Si finalTotal existe, lo usamos. Si no, usamos total.
        total: finalTotal ?? total,

        carrier,
        shipping_mode: shippingMode,
        gateway: gateway || "mercadopago",
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Error insertando order:", orderError);
      return NextResponse.json(
        { ok: false, error: "No se pudo crear el pedido." },
        { status: 500 }
      );
    }

    const orderId = order.id as number;

    // 2) Insertar items
    if (Array.isArray(cart) && cart.length > 0) {
      const itemsToInsert = cart.map((item: any) => ({
        order_id: orderId,
        product_slug: item.slug ?? null,
        name: item.name ?? item.slug ?? "Producto",
        size: item.size ?? null,
        color: item.color ?? null, // 👈 NUEVO: guardamos color
        qty: item.qty,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error insertando order_items:", itemsError);
      }
    }

    return NextResponse.json({ ok: true, orderId });
  } catch (err: any) {
    console.error("Error en /api/order:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno creando el pedido." },
      { status: 500 }
    );
  }
}
