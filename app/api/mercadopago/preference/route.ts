// app/api/mercadopago/preference/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/utils/supabase/server";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.error("MP_ACCESS_TOKEN no está definido en el entorno.");
}

// Dominio base: usa NEXT_PUBLIC_SITE_URL en producción
// y localhost en desarrollo como fallback
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const mpClient = new MercadoPagoConfig({
  accessToken: accessToken || "",
});

type MPItemIn = {
  title: string;
  quantity: number;
  unit_price: number;
};

type Buyer = {
  firstName: string;
  docType: string;
  docNumber: string;
  phone: string;
};

type Shipping = {
  cost: number;
  carrier: string;
  mode: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      items,
      external_reference,
      email,
      buyer,
      shipping,
    } = body as {
      items: MPItemIn[];
      external_reference?: string;
      email?: string;
      buyer?: Buyer;
      shipping?: Shipping;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "No hay ítems para la preferencia." },
        { status: 400 }
      );
    }

    // Adaptar items al formato que espera MP (con id y currency_id)
    const mpItems = items.map((it, idx) => ({
      id: String(idx + 1),
      title: it.title,
      quantity: Number(it.quantity || 1),
      unit_price: Number(it.unit_price),
      currency_id: "PEN",
    }));

    const pref = new Preference(mpClient);

    const preference = await pref.create({
      body: {
        items: mpItems,
        external_reference: external_reference ?? undefined,

        payer: email
          ? {
              email,
              name: buyer?.firstName,
              identification: buyer?.docNumber
                ? {
                    type: buyer?.docType || "DNI",
                    number: buyer.docNumber,
                  }
                : undefined,
              phone: buyer?.phone
                ? {
                    number: buyer.phone,
                  }
                : undefined,
            }
          : undefined,

        shipments: shipping
          ? {
              cost: shipping.cost,
              mode: "not_specified",
              receiver_address: {
                zip_code: "00000",
                state_name: shipping.departamento,
                city_name: shipping.provincia,
                street_name: shipping.direccion,
                // ⚠️ no ponemos "comment" porque el tipo de MP no lo trae
              },
            }
          : undefined,

        // 🔹 URLs de retorno (OBLIGATORIO si usamos auto_return)
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          failure: `${BASE_URL}/checkout/failure`,
          pending: `${BASE_URL}/checkout/pending`,
        },

        auto_return: "approved",

        // 🔹 Webhook (para actualizar el pedido en segundo plano)
        notification_url: `${BASE_URL}/api/mercadopago/webhook`,
      },
    });

    // Opcional pero útil: guardar id de preferencia en la orden
    if (external_reference && preference.id) {
      const supabase = createClient();
      await supabase
        .from("orders")
        .update({
          mp_preference_id: preference.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", external_reference);
    }

    return NextResponse.json({ ok: true, id: preference.id });
  } catch (err: any) {
    console.error("Error creando preferencia MP:", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          err?.message || "Error interno creando la preferencia de pago.",
      },
      { status: 500 }
    );
  }
}
