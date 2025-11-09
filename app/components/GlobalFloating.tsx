// app/components/GlobalFloating.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Carga del FAB SOLO en cliente
const CartFab = dynamic(() => import("@/app/components/CartFab"), {
  ssr: false,
});

export default function GlobalFloating() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Portal al body: siempre anclado al viewport y al fondo
  return createPortal(
    <CartFab z={1000} threshold={200} />, // <-- abajo a la derecha, animado y con “celebración”
    document.body
  );
}
