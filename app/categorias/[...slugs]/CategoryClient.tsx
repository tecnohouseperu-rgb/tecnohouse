// app/categorias/[...slug]/CategoryClient.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductFilters from "@/app/components/ProductFilters";

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

type FiltersState = {
  brands: string[];
  minPrice: number;
  maxPrice: number;
};

type SortOption = "relevance" | "price-asc" | "price-desc";

function getProductImageSrc(url: string | null, fallback: string): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return fallback;
}

export default function CategoryClient({ products, fallbackImg }: Props) {
  // ====== DATOS PARA FILTROS ======
  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const brand = p.brand ?? "Genérico";
      set.add(brand);
    }
    return Array.from(set).sort();
  }, [products]);

  const [priceMin, priceMax] = useMemo(() => {
    if (!products.length) return [0, 0];
    let min = Infinity;
    let max = -Infinity;
    for (const p of products) {
      const price = p.price ?? 0;
      if (price < min) min = price;
      if (price > max) max = price;
    }
    if (!isFinite(min) || !isFinite(max)) return [0, 0];
    return [min, max];
  }, [products]);

  const [filters, setFilters] = useState<FiltersState>({
    brands: [],
    minPrice: priceMin,
    maxPrice: priceMax,
  });

  const [sort, setSort] = useState<SortOption>("relevance");

  // ====== APLICAR FILTROS + ORDEN ======
  const filteredAndSorted = useMemo(() => {
    const filtered = products.filter((p) => {
      const price = p.price ?? 0;

      // precio
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      // marca
      if (filters.brands.length) {
        const brand = p.brand ?? "Genérico";
        if (!filters.brands.includes(brand)) return false;
      }

      return true;
    });

    if (sort === "relevance") return filtered;

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const pa = a.price ?? 0;
      const pb = b.price ?? 0;
      if (sort === "price-asc") return pa - pb;
      if (sort === "price-desc") return pb - pa;
      return 0;
    });

    return sorted;
  }, [products, filters, sort]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      {/* ===== FILTROS ===== */}
      <ProductFilters
        allBrands={brandOptions}
        priceMin={priceMin}
        priceMax={priceMax}
        onChange={(f) => setFilters(f)}
      />

      {/* ===== LISTA DE PRODUCTOS ===== */}
      <section className="space-y-3">
        {/* Barra superior: resultados + orden */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            {filteredAndSorted.length} producto
            {filteredAndSorted.length === 1 ? "" : "s"} encontrados
          </p>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Ordenar por</span>
            <select
              className="rounded-md border bg-white py-1 px-2 text-xs"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No se encontraron productos con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredAndSorted.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* IMAGEN cuadrada */}
                <div className="relative w-full bg-neutral-50 aspect-square">
                  <Image
                    src={getProductImageSrc(p.main_image_url, fallbackImg)}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain p-3 transition group-hover:scale-[1.02]"
                  />
                </div>

                {/* CONTENIDO compacto */}
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

                  {/* Botón (por ahora solo visual) */}
                  <div className="mt-2">
                    <button
                      type="button"
                      className="w-full rounded-md bg-black py-1.5 text-xs md:text-[13px] font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
