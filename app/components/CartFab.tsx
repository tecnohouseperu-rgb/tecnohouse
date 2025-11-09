// app/components/CartFab.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  z?: number;
  threshold?: number; // para mostrar mini “celebración” si cruzas S/200 (opcional)
};

function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

// Lee el contador real del carrito si lo estás guardando en localStorage o en una variable global
function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const g: any = globalThis as any;
        if (typeof g.__CART_COUNT === "number") return g.__CART_COUNT;
        if (g.__CART?.getCount) return Number(g.__CART.getCount()) || 0;

        const raw = localStorage.getItem("cart");
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        }
        if (parsed?.items && Array.isArray(parsed.items)) {
          return parsed.items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0);
        }
      } catch {}
      return 0;
    };

    const update = () => setCount(read());
    update();

    // dispara cuando cambies el carrito
    const onAny = () => update();
    window.addEventListener("cart:updated", onAny as any);
    window.addEventListener("storage", onAny as any);

    const id = window.setInterval(update, 3000);
    return () => {
      window.removeEventListener("cart:updated", onAny as any);
      window.removeEventListener("storage", onAny as any);
      window.clearInterval(id);
    };
  }, []);

  return count;
}

export default function CartFab({ z = 1000 }: Props) {
  const [mounted, setMounted] = useState(false);
  const count = useCartCount();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // evita hidratar en SSR

  const display = count > 99 ? "99+" : String(count);

  // ⚠️ Importante: montamos en <body> para que NUNCA quede “atado” al header sticky/backdrop
  return createPortal(
    (
      <Link
        href="/carrito"
        aria-label="Abrir carrito"
        className={cx(
          "md:hidden",                         // solo en móvil
          "fixed right-4",                     // pegado a la derecha
          "inline-flex items-center gap-2 h-12 px-4 rounded-full",
          "bg-white/95 backdrop-blur border shadow-xl",
          "text-foreground active:scale-[0.98] transition-transform"
        )}
        style={{
          zIndex: z,
          // queda REALMENTE abajo, respetando la safe-area del teléfono
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border">
          <ShoppingCart className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] leading-5 text-white text-center bg-red-600 shadow">
              {display}
            </span>
          )}
        </div>
        <span className="text-sm font-medium">Carrito</span>
      </Link>
    ),
    document.body
  );
}
