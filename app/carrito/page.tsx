// app/carrito/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../components/cart-provider";

export default function CartPage() {
  const { items, clear, removeItem } = useCart();

  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);
  const subtotal = items.reduce(
    (acc, it) => acc + (it.price ?? 0) * it.qty,
    0
  );

  const subtotalLabel = `S/ ${subtotal.toFixed(2)}`;

  /* ======================
     CARRITO VACÍO
     ====================== */
  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] bg-neutral-50 px-4 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white px-6 py-10 sm:px-10 flex flex-col items-center text-center shadow-xl">
            <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />

            {/* FANTASMITA */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <svg
                  viewBox="0 0 120 140"
                  className="h-full w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-bounce"
                >
                  <defs>
                    <linearGradient
                      id="ghostBody"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#e5e7eb" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M60 10c-22 0-38 16-38 38v46c0 5 4 9 9 9 6 0 9-5 13-5s7 5 13 5 9-5 13-5 7 5 13 5c5 0 9-4 9-9V48C98 26 82 10 60 10z"
                    fill="url(#ghostBody)"
                  />
                  <circle cx="45" cy="52" r="5" fill="#111827" />
                  <circle cx="75" cy="52" r="5" fill="#111827" />
                  <path
                    d="M48 70c3 4 7 6 12 6s9-2 12-6"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">
              TECNOHOUSE PERÚ
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              Tu carrito está vacío
            </h1>
            <p className="max-w-md text-sm sm:text-base text-neutral-300 mb-6">
              Aún no has agregado productos. Explora nuestras categorías de{" "}
              <span className="font-semibold text-white">audio</span>,{" "}
              <span className="font-semibold text-white">gamer</span> y{" "}
              <span className="font-semibold text-white">navidad</span> y arma tu próximo pedido.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 shadow hover:bg-neutral-100 active:scale-[0.98] transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la tienda
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] sm:text-xs">
              <Link
                href="/categorias/audio"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-200 hover:bg-white/10 transition"
              >
                Audio
              </Link>
              <Link
                href="/categorias/gamer"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-200 hover:bg-white/10 transition"
              >
                Gamer
              </Link>
              <Link
                href="/categorias/navidad"
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-200 hover:bg-white/10 transition"
              >
                Navidad
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ======================
     CARRITO CON PRODUCTOS
     ====================== */
  return (
    <main className="bg-neutral-50 min-h-[60vh] px-4 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
            Carrito de compras
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            {itemCount} producto{itemCount === 1 ? "" : "s"} ·{" "}
            <span className="font-medium text-neutral-800">{subtotalLabel}</span>
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* LISTA DE ITEMS */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800">
                Productos en tu carrito
              </span>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Vaciar carrito
              </button>
            </div>

            <ul className="divide-y">
              {items.map((item) => {
                const lineTotal = (item.price ?? 0) * item.qty;

                return (
                  <li
                    key={`${item.id}-${item.color ?? "default"}`} // 👈 distingue por color
                    className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-5"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50 border">
                      <Image
                        src={item.mainImage || "/placeholder-product.png"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-1">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                          {item.name}
                        </p>

                        {/* 👇 mostramos el color si existe */}
                        {item.color && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Color:{" "}
                            <span className="capitalize font-medium">
                              {item.color}
                            </span>
                          </p>
                        )}

                        <p className="text-xs text-neutral-500 mt-0.5">
                          Cantidad: {item.qty}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-red-600">
                          S/ {lineTotal.toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-neutral-500 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* RESUMEN */}
          <aside className="h-fit rounded-2xl border bg-white p-4 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              Resumen de compra
            </h2>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">{subtotalLabel}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Costo de envío</span>
                <span>Se calculará en el último paso</span>
              </div>
            </div>

            {/* ⭐ AHORA LLEVA AL CHECKOUT ⭐ */}
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-neutral-900 active:scale-[0.98] transition"
            >
              <ShoppingBag className="h-4 w-4" />
              Continuar con la compra
            </Link>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-1 rounded-full border px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeft className="h-3 w-3" />
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
