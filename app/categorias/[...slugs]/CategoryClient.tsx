// app/categorias/[...slug]/CategoryClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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

const FALLBACK_IMG = "/placeholder-product.png";
const MOBILE_BREAKPOINT = 768;

// src siempre válido
function getProductImageSrc(url: string | null): string {
  if (!url) return FALLBACK_IMG;
  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_IMG;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return FALLBACK_IMG;
}

// Hook simple para saber si estamos en mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function CategoryClient({ products, fallbackImg }: Props) {
  const isMobile = useIsMobile();
  const perPage = isMobile ? 10 : 12;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / perPage));

  // Si cambia el tamaño (10 → 12 o viceversa), volvemos a la página 1
  useEffect(() => {
    setPage(1);
  }, [perPage, products.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return products.slice(start, start + perPage);
  }, [products, page, perPage]);

  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, products.length);

  return (
    <section className="space-y-4">
      {/* GRID DE PRODUCTOS */}
      {pageItems.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aún no hay productos configurados para esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* IMAGEN */}
              <div className="relative w-full bg-neutral-50 aspect-square">
                <Image
                  src={getProductImageSrc(p.main_image_url ?? fallbackImg)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

                {/* Badges */}
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
      )}

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
          <p className="text-xs text-neutral-500">
            Mostrando{" "}
            <span className="font-medium text-neutral-800">
              {startIdx}–{endIdx}
            </span>{" "}
            de {products.length} productos
          </p>

          <div className="inline-flex items-center gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1.5 text-xs rounded-full border ${
                page === 1
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
              className={`px-3 py-1.5 text-xs rounded-full border ${
                page === totalPages
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
