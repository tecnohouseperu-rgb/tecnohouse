import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

function money(n: any) {
  const v = Number(n || 0);
  return `S/ ${v.toFixed(2)}`;
}

function fmtDatePe(value: any) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shipLabel(order: any) {
  const dep = String(order?.departamento || "").trim().toUpperCase();
  const mode = String(order?.shipping_mode || "").trim().toLowerCase();

  const isLimaCallao = dep === "LIMA" || dep === "CALLAO";

  if (isLimaCallao && mode === "express") return "Lima/Callao · Express (mismo día)";
  if (isLimaCallao && mode === "regular") return "Lima/Callao · Regular (24–48h)";
  if (!isLimaCallao) return "Provincia · Regular (48–72h)";
  return "—";
}

function statusPill(orderStatus: any) {
  const s = String(orderStatus || "").toLowerCase();

  if (s.includes("approved") || s.includes("paid") || s === "completed") {
    return { label: "Aprobado", bg: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-700", dot: "bg-emerald-600" };
  }
  if (s.includes("rejected") || s.includes("cancel")) {
    return { label: "Rechazado", bg: "bg-red-50", ring: "ring-red-200", text: "text-red-700", dot: "bg-red-600" };
  }
  return { label: "En verificación", bg: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-700", dot: "bg-amber-600" };
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
      <div className="border-b border-black/5 px-6 py-4">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string }>;
}) {
  const { external_reference } = await searchParams;
  if (!external_reference) return null;

  // ✅ En TecnoHouse: external_reference = ID de orders (int8)
  const orderId = Number(external_reference);
  if (!Number.isFinite(orderId)) return null;

  const sb = supabaseServer();

  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#F6F7F9]">
        <div className="mx-auto max-w-3xl px-5 py-14">
          <div className="rounded-3xl bg-gradient-to-r from-[#111827] to-[#0B1220] p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
              TecnoHouse Perú
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Pago pendiente
            </h1>
            <p className="mt-2 text-sm text-white/75">
              No encontramos la orden con esa referencia.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link className="rounded-xl bg-white text-black px-4 py-3 text-center text-sm font-semibold" href="/checkout">
                Volver al checkout
              </Link>
              <Link className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-center text-sm font-semibold text-white" href="/">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Items vienen de order_items
  const { data: orderItems } = await sb
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  const items = Array.isArray(orderItems) ? orderItems : [];

  const pill = statusPill(order.status);

  return (
    <div className="min-h-[70vh] bg-[#F6F7F9]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        {/* HERO */}
        <div className="rounded-3xl bg-gradient-to-r from-[#111827] to-[#0B1220] p-7 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
                TecnoHouse Perú
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Pago pendiente
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Estamos validando tu pago. Si ya pagaste, puede demorar unos minutos en reflejarse.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className={`inline-flex items-center gap-2 rounded-full ${pill.bg} px-3 py-1 text-[12px] font-semibold ${pill.text} ring-1 ${pill.ring}`}>
                <span className={`h-2 w-2 rounded-full ${pill.dot} opacity-70`} />
                {pill.label}
              </span>
              <div className="text-xs text-white/70">
                Orden: <span className="font-semibold text-white">{order.id}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
            Tip: espera 1–3 minutos y presiona “Actualizar estado”. MercadoPago/Socio a veces confirma en segundo plano.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card title="Productos">
              <div className="space-y-4">
                {items.map((it: any) => {
                  // Ajusta aquí si tu order_items usa otros nombres
                  const title = it.title || it.name || it.slug || "Producto";
                  const img = it.image || it.main_image || it.img || null;

                  const qty = Number(it.qty || it.quantity || 0);
                  const unit = Number(it.unit_price || it.price || 0);
                  const line = qty * unit;

                  return (
                    <div
                      key={it.id}
                      className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 hover:shadow-sm transition"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-black/5 flex-shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-semibold">{title}</div>

                            <div className="mt-1 text-xs text-black/60">
                              Cant: {qty}
                              {it.color_name ? ` · Color: ${it.color_name}` : ""}
                              {it.size_label ? ` · Talla: ${it.size_label}` : ""}
                              {it.color ? ` · Color: ${it.color}` : ""}
                              {it.size ? ` · Talla: ${it.size}` : ""}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-black/60">Unit: {money(unit)}</div>
                            <div className="mt-1 text-sm font-semibold">{money(line)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 ? (
                  <div className="text-sm text-black/60">
                    No se encontraron items para esta orden.
                  </div>
                ) : null}
              </div>
            </Card>

            <Card title="Entrega y cliente">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Envío</div>
                  <div className="mt-1 text-sm font-semibold">{shipLabel(order)}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Carrier</div>
                  <div className="mt-1 text-sm">{order.carrier || "—"}</div>

                  <div className="mt-4 text-xs font-semibold text-black/60">Dirección</div>
                  <div className="mt-1 text-sm">{order.direccion || "—"}</div>
                  {order.referencia ? (
                    <div className="mt-1 text-xs text-black/60">Ref: {order.referencia}</div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Cliente</div>
                  <div className="mt-1 text-sm font-semibold">{order.nombres || "—"}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Documento</div>
                  <div className="mt-1 text-sm">
                    {order.doc_type || "—"} {order.doc_number || ""}
                  </div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Correo</div>
                  <div className="mt-1 text-sm">{order.email || "—"}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Teléfono</div>
                  <div className="mt-1 text-sm">{order.telefono || "—"}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Ubicación</div>
                  <div className="mt-1 text-sm">
                    {order.departamento || "—"}, {order.provincia || "—"}, {order.distrito || "—"}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold tracking-tight">Resumen</div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-black/70">
                    <span>Subtotal</span>
                    <span>{money(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-black/70">
                    <span>Descuento</span>
                    <span>- {money(order.discount || 0)}</span>
                  </div>

                  <div className="flex justify-between text-black/70">
                    <span>Envío</span>
                    <span>{money(order.envio)}</span>
                  </div>

                  <div className="my-3 h-px bg-black/10" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{money(order.total)}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-200">
                  <div className="font-semibold">Recomendación</div>
                  <div className="mt-1">
                    Espera 1–3 minutos y recarga la página. A veces el gateway confirma en segundo plano.
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <a
                    className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
                    href={`/checkout/pending?external_reference=${encodeURIComponent(String(order.id))}`}
                  >
                    Actualizar estado
                  </a>

                  <Link
                    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold"
                    href="/checkout"
                  >
                    Volver al checkout
                  </Link>
                </div>

                <div className="mt-4 text-xs text-black/50">
                  Creada: <span className="font-semibold">{fmtDatePe(order.created_at)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold">¿Hubo un error?</div>
                <p className="mt-2 text-sm text-black/60">
                  Si tu pago fue rechazado, vuelve al checkout y prueba otro método.
                </p>
                <div className="mt-4">
                  <Link className="text-sm font-semibold underline underline-offset-4" href="/">
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-black/45">
          TecnoHouse Perú · Gracias por tu compra
        </div>
      </div>
    </div>
  );
}