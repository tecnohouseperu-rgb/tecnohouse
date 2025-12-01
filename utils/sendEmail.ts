// utils/sendEmail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type OrderStatus = "approved" | "pending";

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  size?: string;
};

type SendOrderEmailParams = {
  to: string;
  status: OrderStatus;
  orderId: string;
  amount: number;

  customerName?: string;
  shippingAddress?: string;
  shippingDistrict?: string;
  shippingReference?: string;
  shippingPhone?: string;
  items?: OrderItem[];
};

export async function sendOrderEmail({
  to,
  status,
  orderId,
  amount,
  customerName,
  shippingAddress,
  shippingDistrict,
  shippingReference,
  shippingPhone,
  items,
}: SendOrderEmailParams) {
  const subject =
    status === "approved"
      ? `✅ Pago confirmado - Pedido ${orderId}`
      : `⏳ Pago pendiente - Pedido ${orderId}`;

  const statusLabel =
    status === "approved" ? "PAGO CONFIRMADO ✅" : "PAGO PENDIENTE ⏳";

  const itemsRows = (items ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">
            <div>${item.name}</div>
            ${
              item.size
                ? `<div style="font-size:12px; color:#6b7280;">Talla: ${item.size}</div>`
                : ""
            }
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">
            S/ ${item.unitPrice.toFixed(2)}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align:right;">
            S/ ${(item.unitPrice * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const itemsTable =
    items && items.length > 0
      ? `
      <h2 style="font-size:16px; margin: 24px 0 8px;">Detalle de productos</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr>
            <th align="left" style="padding: 8px 12px; border-bottom: 2px solid #333;">Producto</th>
            <th align="center" style="padding: 8px 12px; border-bottom: 2px solid #333;">Cant.</th>
            <th align="right" style="padding: 8px 12px; border-bottom: 2px solid #333;">P. Unit.</th>
            <th align="right" style="padding: 8px 12px; border-bottom: 2px solid #333;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    `
      : "";

  const shippingBlock =
    shippingAddress ||
    shippingDistrict ||
    shippingPhone ||
    shippingReference ||
    customerName
      ? `
      <h2 style="font-size:16px; margin: 24px 0 8px;">Datos de envío</h2>
      <div style="font-size:14px; line-height:1.6;">
        ${
          customerName
            ? `<p><strong>Cliente:</strong> ${customerName}</p>`
            : ""
        }
        ${
          shippingAddress
            ? `<p><strong>Dirección:</strong> ${shippingAddress}</p>`
            : ""
        }
        ${
          shippingDistrict
            ? `<p><strong>Distrito / Ciudad:</strong> ${shippingDistrict}</p>`
            : ""
        }
        ${
          shippingReference
            ? `<p><strong>Referencia:</strong> ${shippingReference}</p>`
            : ""
        }
        ${
          shippingPhone
            ? `<p><strong>Teléfono:</strong> ${shippingPhone}</p>`
            : ""
        }
      </div>
    `
      : "";

  const introText =
    status === "approved"
      ? `Hemos recibido tu pago correctamente. 🎉`
      : `Hemos registrado tu pedido, pero el pago aún figura como <strong>pendiente</strong>.`;

  const ctaText =
    status === "approved"
      ? "Ver estado de mi pedido"
      : "Ver opciones de pago";

  const ctaUrl = "https://tecnohouseperu.com"; // cámbialo luego a /mis-pedidos

  const html = `
  <div style="background-color:#f4f4f5; padding:24px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.06); font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#111827,#EF4444); color:#fff; padding:18px 24px;">
        <h1 style="margin:0; font-size:20px;">TecnoHouse Perú</h1>
        <p style="margin:4px 0 0; font-size:13px; opacity:0.9;">Tecnología, gamer, navidad y más.</p>
      </div>

      <!-- Body -->
      <div style="padding:24px 24px 28px;">
        
        <div style="font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#059669; margin-bottom:6px;">
          ${statusLabel}
        </div>

        <h2 style="margin:0 0 8px; font-size:22px; color:#111827;">
          ¡Gracias por tu compra${customerName ? `, ${customerName}` : ""}!
        </h2>
        <p style="margin:0 0 16px; font-size:14px; color:#4b5563;">
          ${introText}
        </p>

        <div style="background:#f9fafb; border-radius:10px; padding:12px 16px; border:1px solid #e5e7eb; margin-bottom:16px;">
          <p style="margin:0; font-size:13px; color:#6b7280;">
            <strong>Pedido:</strong> ${orderId}
          </p>
          <p style="margin:4px 0 0; font-size:13px; color:#6b7280;">
            <strong>Total:</strong> S/ ${amount.toFixed(2)}
          </p>
        </div>

        ${itemsTable}
        ${shippingBlock}

        <div style="margin:24px 0 12px;">
          <a href="${ctaUrl}" 
             style="display:inline-block; padding:10px 18px; border-radius:999px; background:#111827; color:#ffffff; font-size:14px; text-decoration:none;">
            ${ctaText}
          </a>
        </div>

        <p style="font-size:12px; color:#9ca3af; margin-top:16px;">
          Si no reconoces esta compra, por favor responde a este correo o contáctanos a 
          <strong>ventas@tecnohouseperu.com</strong>.
        </p>
      </div>

      <div style="border-top:1px solid #e5e7eb; padding:12px 16px; text-align:center; font-size:11px; color:#9ca3af;">
        TecnoHouse Perú &middot; Lima, Perú<br/>
        Gracias por confiar en nosotros 💻🎧🎄
      </div>
    </div>
  </div>
  `;

  const text = `
TecnoHouse Perú - ${status === "approved" ? "Pago confirmado" : "Pago pendiente"}
Pedido: ${orderId}
Total: S/ ${amount.toFixed(2)}
  `;

  try {
    await resend.emails.send({
      from: "TecnoHouse Perú <no-reply@notifications.tecnohouseperu.com>",
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("❌ Error enviando correo de pedido:", error);
  }
}
