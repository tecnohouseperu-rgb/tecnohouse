// app/components/ProductFilters.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";

type Filters = {
  brands: string[];
  minPrice: number;
  maxPrice: number;
};

type Props = {
  /** Marcas disponibles en la categoría */
  allBrands: string[];

  /** Rango real de precios de tus productos */
  priceMin: number;
  priceMax: number;

  /** Llamado cada vez que cambian los filtros */
  onChange: (filters: Filters) => void;
};

function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

export default function ProductFilters({
  allBrands,
  priceMin,
  priceMax,
  onChange,
}: Props) {
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(priceMin);
  const [maxPrice, setMaxPrice] = useState(priceMax);

  // Normalizar min/max si cambian desde el servidor
  useEffect(() => {
    setMinPrice(priceMin);
    setMaxPrice(priceMax);
  }, [priceMin, priceMax]);

  // Avisar al padre cuando cambien filtros
  useEffect(() => {
    onChange({ brands: selectedBrands, minPrice, maxPrice });
  }, [selectedBrands, minPrice, maxPrice, onChange]);

  const filteredBrands = useMemo(() => {
    const q = searchBrand.trim().toLowerCase();
    if (!q) return allBrands;
    return allBrands.filter((b) => b.toLowerCase().includes(q));
  }, [allBrands, searchBrand]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setMinPrice(priceMin);
    setMaxPrice(priceMax);
  };

  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-neutral-600" />
            <h2 className="text-sm font-semibold text-neutral-900">
              Filtros
            </h2>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] font-medium text-blue-600 hover:underline"
          >
            Limpiar
          </button>
        </div>

        {/* MARCAS */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-neutral-700 tracking-wide">
            MARCA
          </p>

          {/* buscador de marca */}
          {allBrands.length > 4 && (
            <div className="relative mb-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                placeholder="Buscar marca…"
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 pl-7 pr-2 py-1.5 text-[11px] outline-none focus:ring-1 ring-neutral-300"
              />
            </div>
          )}

          <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
            {filteredBrands.length === 0 && (
              <p className="text-[11px] text-neutral-400">
                No se encontraron marcas.
              </p>
            )}

            {filteredBrands.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 rounded-md px-1 py-1 cursor-pointer hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-black focus:ring-0"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className="text-xs text-neutral-800">{brand}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* PRECIO */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-neutral-700 tracking-wide">
            PRECIO
          </p>

          <div className="flex items-center justify-between text-[11px] text-neutral-600">
            <span>Desde {`S/ ${minPrice.toFixed(0)}`}</span>
            <span>Hasta {`S/ ${maxPrice.toFixed(0)}`}</span>
          </div>

          {/* dos sliders simples: mínimo y máximo */}
          <div className="space-y-1">
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={1}
              value={minPrice}
              onChange={(e) =>
                setMinPrice(
                  Math.min(Number(e.target.value) || priceMin, maxPrice)
                )
              }
              className="w-full"
            />
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={1}
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  Math.max(Number(e.target.value) || priceMax, minPrice)
                )
              }
              className="w-full"
            />
          </div>

          <p className="mt-1 text-[11px] text-neutral-400 flex items-center gap-1">
            Próximamente filtros avanzados
            <span role="img" aria-label="lupa">
              🔍
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}
