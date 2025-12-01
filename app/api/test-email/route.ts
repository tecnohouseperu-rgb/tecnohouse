// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/utils/sendEmail";

export async function GET() {
  try {
    await sendOrderEmail({
      to: "louisjohnatan25@gmail.com", // pon tu correo
      status: "approved",
      orderId: "TEST-999",
      amount: 349.9,

      customerName: "Luis Johnatan",
      shippingAddress: "Av. Siempre Viva 123",
      shippingDistrict: "Los Olivos - Lima - Lima",
      shippingReference: "Altura del parque principal",
      shippingPhone: "999 888 777",

      items: [
        {
          name: "Audífonos Gamer RGB X500",
          size: undefined,
          quantity: 1,
          unitPrice: 199.9,
        },
        {
          name: "Mouse Gamer Inalámbrico",
          size: undefined,
          quantity: 1,
          unitPrice: 150,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      message: "Correo de prueba enviado 🎉",
    });
  } catch (e) {
    console.error("Error enviando email de prueba:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
