"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";

const FALLBACK_IMG = "/placeholder-product.png";

export default function CartToast() {
  const { toastVisible, lastAdded, hideToast } = useCart();

  if (!toastVisible || !lastAdded) return null;

  const img =
    lastAdded.mainImage && lastAdded.mainImage.trim()
      ? lastAdded.mainImage
      : FALLBACK_IMG;

  return (
    <div
      className="
        fixed z-[80] w-full max-w-sm px-4
        left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        md:left-auto md:right-4 md:top-auto md:bottom-4 md:translate-x-0 md:translate-y-0
      "
    >
      <div className="flex gap-3 rounded-2xl bg-neutral-900/95 p-3 text-white shadow-2xl ring-1 ring-black/40">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-800">
          <Image
            src={img}
            alt={lastAdded.name}
            fill
            className="object-contain p-1.5"
          />
        </div>

        <div className="flex-1">
          <p className="text-xs font-medium text-emerald-300">
            Producto añadido al carrito
          </p>
          <p className="line-clamp-2 text-sm font-semibold">
            {lastAdded.name}
          </p>
          <p className="mt-1 text-xs text-neutral-300">
            Cantidad: <span className="font-semibold">{lastAdded.qty}</span> ·{" "}
            <span className="font-semibold">
              S/ {lastAdded.price ?? "0.00"}
            </span>
          </p>

          <div className="mt-2 flex gap-2">
            <Link
              href="/carrito"
              onClick={hideToast}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Ver carrito
            </Link>
            <button
              type="button"
              onClick={hideToast}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-100 hover:bg-neutral-700"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
