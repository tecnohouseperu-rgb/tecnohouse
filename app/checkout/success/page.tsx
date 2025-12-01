"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import successAnimation from "@/public/lottie/success.json";

type OrderItem = {
  id: number | string;
  name: string;
  qty: number;
  price: number;
  size?: string | null;
};

type OrderSummary = {
  orderId: string;
  subtotal: number;
  envio: number;
  total: number;
  nombres: string;
  telefono: string;
  email: string;
  direccion: string;
  referencia?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  shippingMode: string;
  carrier: string;
  items: OrderItem[];
};

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("last-order-summary");
      if (!raw) return;
      const parsed = JSON.parse(raw) as OrderSummary;
      setOrder(parsed);
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-[70vh] bg-neutral-50">
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)] gap-8 items-start">
          {/* Columna izquierda: animación + mensaje principal */}
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 px-6 py-8 flex flex-col items-center text-center">
            <div className="w-52 h-52 mb-2">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ¡Pago exitoso! 🎉
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-md">
              {order?.nombres
                ? `Gracias por tu compra, ${order.nombres}.`
                : "Gracias por tu compra."}{" "}
              Estamos procesando tu pedido y te avisaremos por WhatsApp y correo
              cuando esté listo para envío.
            </p>

            {order && (
              <div className="mt-5 flex flex-col items-center gap-1 text-sm text-gray-600">
                <span>
                  <span className="font-semibold">N° de pedido:</span>{" "}
                  #{order.orderId}
                </span>
                <span className="text-xs text-gray-500">
                  Guarda este número para cualquier consulta.
                </span>
              </div>
            )}

            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-900 transition"
            >
              Volver a la tienda
            </Link>
          </div>

          {/* Columna derecha: resumen detallado */}
          <div className="space-y-4">
            {/* Resumen del pago */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Resumen del pago
              </h2>
              {order ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>S/ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Envío ·{" "}
                      {order.shippingMode === "express"
                        ? "Express"
                        : "Regular"}{" "}
                      ({order.carrier})
                    </span>
                    <span>
                      {order.envio === 0
                        ? "Gratis"
                        : `S/ ${order.envio.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-gray-200 text-sm font-semibold">
                    <span>Total pagado</span>
                    <span className="text-lg">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Método de pago: <strong>Mercado Pago</strong>.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Tu pago se registró correctamente. Si no ves el detalle,
                  recarga la página o revisa tu correo de confirmación.
                </p>
              )}
            </div>

            {/* Detalles de envío */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Detalles de envío
              </h2>
              {order ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.nombres}</p>
                  <p>{order.direccion}</p>
                  {order.referencia && (
                    <p className="text-gray-500">
                      Ref: {order.referencia}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.distrito}, {order.provincia}, {order.departamento}
                  </p>
                  <p className="text-gray-600">
                    Teléfono: <span className="font-medium">{order.telefono}</span>
                  </p>
                  <p className="text-gray-600">
                    Correo: <span className="font-medium">{order.email}</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Envío{" "}
                    <strong>
                      {order.shippingMode === "express"
                        ? "express (mismo día)"
                        : "regular"}
                    </strong>{" "}
                    vía <strong>{order.carrier}</strong>.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No pudimos recuperar los datos del envío desde este
                  navegador, pero los hemos guardado junto con tu pedido.
                </p>
              )}
            </div>

            {/* Productos comprados (SIN fotos) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Productos de tu pedido
              </h2>
              {order && order.items.length > 0 ? (
                <ul className="space-y-2 max-h-64 overflow-auto pr-1 text-sm">
                  {order.items.map((it) => (
                    <li
                      key={`${it.id}-${it.size ?? "std"}`}
                      className="flex items-center justify-between gap-3 border-b last:border-b-0 border-dashed border-gray-200 pb-1"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 line-clamp-2">
                          {it.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cantidad: {it.qty}
                          {it.size ? ` · Talla ${it.size}` : ""}
                        </p>
                      </div>
                      <div className="text-sm font-semibold whitespace-nowrap">
                        S/ {(it.price * it.qty).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No se pudo cargar el detalle de productos, pero están
                  registrados en tu pedido.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-5 text-xs md:text-sm text-gray-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} TecnoHouse Perú. Todos los derechos
            reservados.
          </p>
          <div className="flex flex-wrap gap-4">
            <span>
              WhatsApp:{" "}
              <a
                href="https://wa.me/51908577861"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gray-700 hover:underline"
              >
                +51 908 577 861
              </a>
            </span>
            <span>
              Facebook:{" "}
              <span className="font-medium text-gray-700">
                @tecnohouseperu
              </span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
