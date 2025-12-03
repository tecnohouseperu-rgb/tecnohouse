"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  old_price: number | null;
  main_image_url: string | null;
  brand: string | null;
  tags: string[] | null;
  is_active: boolean;
  subcategory_id: number | null;
};

type Props = {
  products: Product[];
  fallbackImg: string;
};

function getProductImageSrc(url: string | null, fallback: string): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return fallback;
}

export default function CategoryClient({ products, fallbackImg }: Props) {
  const [pageSize, setPageSize] = useState(12); // por defecto desktop
  const [page, setPage] = useState(1);

  // Ajustar pageSize según ancho (10 mobile, 12 desktop)
  useEffect(() => {
    const updatePageSize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 1024) {
        setPageSize(10); // mobile / tablet
      } else {
        setPageSize(12); // desktop
      }
      setPage(1); // siempre volver a página 1 al cambiar
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const totalProducts = products.length;
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalProducts / pageSize)) : 1;

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleProducts = products.slice(startIndex, startIndex + pageSize);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  if (totalProducts === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Aún no hay productos configurados para esta categoría.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {visibleProducts.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* IMAGEN */}
            <div className="relative w-full bg-neutral-50 aspect-square">
              <Image
                src={getProductImageSrc(p.main_image_url, fallbackImg)}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-contain p-3 transition group-hover:scale-[1.02]"
              />
            </div>

            {/* CONTENIDO */}
            <div className="flex flex-1 flex-col gap-1 p-2.5">
              {p.brand && (
                <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                  {p.brand}
                </p>
              )}

              <p className="line-clamp-2 text-[13px] font-medium text-neutral-800 group-hover:text-blue-600">
                {p.name}
              </p>

              {/* Precio */}
              <div className="mt-1 flex items-baseline gap-1.5">
                {p.old_price && (
                  <p className="text-[11px] text-neutral-400 line-through">
                    S/ {p.old_price}
                  </p>
                )}
                <p className="text-base font-semibold text-red-600">
                  S/ {p.price}
                </p>
              </div>

              {/* BADGES */}
              <div className="mt-1 flex flex-wrap gap-1">
                {p.tags?.includes("tienda-web") && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    Tienda y web
                  </span>
                )}
                {p.tags?.includes("solo-web") && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    Solo web
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`rounded-full border px-3 py-1 ${
              currentPage === 1
                ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1;
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`h-8 min-w-[2rem] rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`rounded-full border px-3 py-1 ${
              currentPage === totalPages
                ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
