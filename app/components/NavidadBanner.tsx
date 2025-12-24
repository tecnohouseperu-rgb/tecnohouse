"use client";

import { useEffect, useState } from "react";

export function NavidadBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      // evitar que vuelva a salir si el usuario lo cerró
      const dismissed = localStorage.getItem("navidad2025-banner-dismissed");
      if (dismissed === "true") return;

      const now = new Date();
      const month = now.getMonth(); // 0 = enero, 11 = diciembre
      const day = now.getDate();

      // Mostrar SOLO 24 y 25 de diciembre
      if (month === 11 && (day === 24 || day === 25)) {
        setOpen(true);
      }
    } catch {
      const now = new Date();
      const month = now.getMonth();
      const day = now.getDate();
      if (month === 11 && (day === 24 || day === 25)) {
        setOpen(true);
      }
    }
  }, []);

  const closeBanner = () => {
    setOpen(false);
    try {
      localStorage.setItem("navidad2025-banner-dismissed", "true");
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeBanner}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl p-3 text-center animate-in fade-in zoom-in duration-200">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={closeBanner}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Cerrar anuncio"
        >
          ×
        </button>

        {/* Banner */}
        <img
          src="/banners/banner-descuento.jpg"
          alt="Navidad - 10% de descuento TecnoHouse"
          className="w-full h-auto rounded-xl select-none"
        />

        {/* Botón CTA opcional */}
        <a
          href="/"
          onClick={closeBanner}
          className="mt-3 inline-block w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-3 text-sm"
        >
          IR A LA TIENDA 🎁
        </a>
      </div>
    </div>
  );
}
