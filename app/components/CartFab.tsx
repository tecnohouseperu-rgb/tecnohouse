"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./cart-provider";

type Props = {
  z?: number;
  threshold?: number; // lo dejamos por si luego quieres usarlo
};

function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

export default function CartFab({ z = 1000 }: Props) {
  const [mounted, setMounted] = useState(false);
  const { count } = useCart(); // 👈 usamos el contexto del carrito

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // evita problemas en SSR

  const display = count > 99 ? "99+" : String(count);

  return createPortal(
    (
      <Link
        href="/carrito"
        aria-label="Abrir carrito"
        className={cx(
          "md:hidden", // solo en móvil
          "fixed right-4",
          "inline-flex items-center gap-2 h-12 px-4 rounded-full",
          "bg-white/95 backdrop-blur border shadow-xl",
          "text-foreground active:scale-[0.98] transition-transform"
        )}
        style={{
          zIndex: z,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border">
          <ShoppingCart className="h-4 w-4" />
          {/* burbuja siempre visible, incluso en 0 si quieres */}
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] leading-5 text-white text-center bg-red-600 shadow">
            {display}
          </span>
        </div>
        <span className="text-sm font-medium">Carrito</span>
      </Link>
    ),
    document.body
  );
}
