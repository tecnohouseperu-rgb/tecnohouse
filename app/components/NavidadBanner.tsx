"use client";

import { useEffect, useState } from "react";

export function NavidadBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 👉 Ahora SIEMPRE se abre cuando carga la página
    setOpen(true);
  }, []);

  const closeBanner = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={closeBanner}   // 👈 clic en cualquier parte cierra
    >
      {/* Overlay con blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative mx-4 w-full max-w-sm rounded-3xl bg-white/95 shadow-2xl ring-1 ring-white/60 overflow-hidden animate-in fade-in zoom-in duration-200 cursor-pointer"
      >
        {/* Botón cerrar (extra pero útil) */}
        <button
          type="button"
          onClick={closeBanner}
          className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-gray-700 hover:bg-white shadow-sm text-sm"
          aria-label="Cerrar anuncio"
        >
          ✕
        </button>

        {/* Imagen */}
        <div className="p-3 sm:p-4">
          <img
            src="/banners/banner-descuento.jpg"
            alt="Navidad TecnoHouse - 10% descuento"
            className="w-full h-auto rounded-2xl border border-pink-100 shadow-sm select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
