"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductAddToCart } from "../../components/ProductAddToCart";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  old_price: number | null;
  main_image_url: string | null;
  gallery_urls: string[] | null;
  tags: string[] | null;
  availability: string | null;
  description: string | null;
  features: string | null;
  attributes: Record<string, any> | null;
};

type Props = {
  product: Product;
  images: string[];
  colors: string[];
  availabilityLabel: string;
  similar: Product[];
  fallbackImg: string;
};

export default function ProductDetailClient({
  product,
  images,
  colors,
  availabilityLabel,
  similar,
  fallbackImg,
}: Props) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0] ?? null
  );
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  // Cerrar modal con ESC
  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const mainImage = images[selectedImgIndex] ?? fallbackImg;

  // features -> array de líneas
  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const featurePreview = featuresExpanded ? featureLines : featureLines.slice(0, 5);
  const hasMoreFeatures = featureLines.length > 5;

  return (
    <>
      {/* ===== TÍTULO MOBILE (arriba de las fotos) ===== */}
      <div className="mb-4 md:hidden">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
          <h1 className="text-base font-semibold text-neutral-900 mb-2">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
              {availabilityLabel}
            </span>

            {product.tags?.includes("solo-web") && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                Solo web
              </span>
            )}
            {product.tags?.includes("tienda-web") && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                Tienda y web
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        {/* ===== GALERÍA ===== */}
        <section className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[88px,1fr]">
            {/* MINIATURAS (desktop) */}
            <div className="hidden md:flex flex-col gap-3">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImgIndex(idx);
                    setIsModalOpen(true);
                  }}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-neutral-50 transition ${
                    idx === selectedImgIndex
                      ? "border-black ring-2 ring-black/10"
                      : "border-neutral-200 hover:border-black"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>

            {/* IMAGEN PRINCIPAL */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="relative w-full aspect-[4/5] max-h-[430px] overflow-hidden rounded-2xl bg-neutral-50 group"
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 md:p-6"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                  Click para ampliar
                </span>
              </button>

              {/* MINIATURAS MOBILE (slider) */}
              <div className="flex gap-2 overflow-x-auto md:hidden">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImgIndex(idx);
                      setIsModalOpen(true);
                    }}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-neutral-50 transition ${
                      idx === selectedImgIndex
                        ? "border-black ring-2 ring-black/10"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== INFO ===== */}
        <section className="space-y-4">
          {/* TÍTULO + DISPONIBILIDAD (solo desktop) */}
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
            <h1 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-2">
              {product.name}
            </h1>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                {availabilityLabel}
              </span>

              {product.tags?.includes("solo-web") && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                  Solo web
                </span>
              )}
              {product.tags?.includes("tienda-web") && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                  Tienda y web
                </span>
              )}
            </div>
          </div>

          {/* PRECIO + BOTÓN CARRITO */}
          <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm space-y-3">
            <div className="space-y-1">
              {product.old_price && (
                <p className="text-sm text-neutral-400 line-through">
                  S/ {product.old_price}
                </p>
              )}
              <p className="text-3xl font-semibold text-red-600">
                S/ {product.price}
              </p>
              <p className="text-xs text-neutral-500">
                Precio incluye IGV. Stock sujeto a confirmación.
              </p>
            </div>

            <ProductAddToCart
              id={product.id}
              name={product.name}
              price={product.price ?? 0}
              mainImage={product.main_image_url ?? fallbackImg}
            />
          </div>

          {/* COLORES */}
          {colors.length > 0 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <h3 className="mb-1.5 text-sm font-semibold text-neutral-800">
                Colores disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isActive = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 text-neutral-700 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DESCRIPCIÓN */}
          {product.description && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-neutral-800">
                Descripción del producto
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* CARACTERÍSTICAS */}
          {featureLines.length > 0 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-neutral-800">
                Características principales
              </h3>
              <ul className="list-disc space-y-1 pl-4 text-sm text-neutral-700">
                {featurePreview.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              {hasMoreFeatures && (
                <button
                  type="button"
                  onClick={() => setFeaturesExpanded((v) => !v)}
                  className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  {featuresExpanded
                    ? "Ver menos"
                    : "Ver todas las características"}
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* PRODUCTOS SIMILARES */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            Productos similares
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {similar.map((p) => (
              <a
                key={p.id}
                href={`/producto/${p.slug}`}
                className="group w-40 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-square w-full bg-neutral-50">
                  <Image
                    src={p.main_image_url ?? fallbackImg}
                    alt={p.name}
                    fill
                    sizes="160px"
                    className="object-contain p-3"
                  />
                </div>
                <div className="space-y-1 p-2.5">
                  <p className="line-clamp-2 text-[12px] font-medium text-neutral-800 group-hover:text-blue-600">
                    {p.name}
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    S/ {p.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* MODAL DE IMAGEN AMPLIADA */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute -right-2 -top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900">
              <Image
                src={mainImage}
                alt={product.name}
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
