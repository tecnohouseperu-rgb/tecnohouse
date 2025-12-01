"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  fallbackImg: string;
};

export default function ProductGallery({ images, alt, fallbackImg }: Props) {
  const safeImages = images.length ? images : [fallbackImg];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const activeSrc = safeImages[activeIndex];

  // Cerrar con ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      {/* GALERÍA NORMAL */}
      <section className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[88px,1fr]">
          {/* miniaturas desktop */}
          <div className="hidden md:flex flex-col gap-3">
            {safeImages.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border ${
                  idx === activeIndex
                    ? "border-black"
                    : "border-neutral-200"
                } bg-neutral-50 hover:border-black transition`}
              >
                <Image
                  src={src}
                  alt={`${alt} ${idx + 1}`}
                  fill
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>

          {/* imagen principal + miniaturas mobile */}
          <div className="flex flex-col gap-3">
            {/* imagen principal */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative w-full aspect-[4/5] max-h-[430px] overflow-hidden rounded-2xl bg-neutral-50 group"
            >
              <Image
                src={activeSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 md:p-6"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition" />
            </button>

            {/* miniaturas mobile (slider horizontal) */}
            <div className="flex gap-2 overflow-x-auto md:hidden">
              {safeImages.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${
                    idx === activeIndex
                      ? "border-black"
                      : "border-neutral-200"
                  } bg-neutral-50`}
                >
                  <Image
                    src={src}
                    alt={`${alt} ${idx + 1}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX / MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* FONDO OSCURO: cierra al hacer click afuera */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />

          {/* CONTENIDO DEL MODAL */}
          <div className="relative z-10 max-w-3xl w-full max-h-[90vh] rounded-2xl bg-neutral-900/80 p-3 md:p-4">
            {/* Botón cerrar (X) con z-20 para estar encima de la imagen */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white hover:bg-black"
            >
              ✕
            </button>

            <div className="relative w-full aspect-[4/5] max-h-[80vh]">
              <Image
                src={activeSrc}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
