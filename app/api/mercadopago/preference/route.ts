// app/api/mercadopago/preference/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/utils/supabase/server";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.error("MP_ACCESS_TOKEN no está definido en el entorno.");
}

// 🔹 Dominio base: tomado de .env (NEXT_PUBLIC_SITE_URL)
//    en local, si no está definido, usa http://localhost:3000
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const mpClient = new MercadoPagoConfig({
  accessToken: accessToken || "", // para evitar crash si falta
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { items, external_reference, email, buyer, shipping } = body as {
      items: { title: string; quantity: number; unit_price: number }[];
      external_reference?: string; // aquí estás mandando el orderId
      email?: string;
      buyer?: {
        firstName: string;
        docType: string;
        docNumber: string;
        phone: string;
      };
      shipping?: {
        cost: number;
        carrier: string;
        mode: string;
        departamento: string;
        provincia: string;
        distrito: string;
        direccion: string;
        referencia?: string;
      };
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "No hay ítems para la preferencia." },
        { status: 400 }
      );
    }

    const pref = new Preference(mpClient);

    const preference = await pref.create({
      body: {
        items,
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
                comment: shipping.referencia,
              },
            }
          : undefined,

        // 🔹 URLs de retorno usando el dominio configurado
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          failure: `${BASE_URL}/checkout/failure`,
          pending: `${BASE_URL}/checkout/pending`,
        },
        auto_return: "approved",

        // 🔹 Webhook para estados en tiempo real
        notification_url: `${BASE_URL}/api/mercadopago/webhook`,
      },
    });

    // 🔹 Guardar el mp_preference_id en la orden (si tenemos external_reference = orderId)
    if (external_reference && preference.id) {
      try {
        const supabase = createClient();
        await supabase
          .from("orders")
          .update({
            mp_preference_id: preference.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", external_reference); // external_reference es el orderId que mandas desde el front
      } catch (e) {
        console.error("No se pudo actualizar mp_preference_id en orders:", e);
      }
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
