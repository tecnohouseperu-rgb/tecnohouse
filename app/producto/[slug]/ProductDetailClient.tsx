// app/producto/[slug]/ProductDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { ProductAddToCart } from "../../components/ProductAddToCart";

type ColorVariant = {
  name: string;
  hex?: string;
  images?: string[];
};

type SizeVariant = {
  name: string;      // "1.2 m"
  code?: string;     // "120"
  price?: number;    // precio específico
  images?: string[]; // fotos específicas
};

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
  color_variants: ColorVariant[] | null;
  size_variants: SizeVariant[] | null;
};

type Props = {
  product: Product;
  images: string[];
  availabilityLabel: string;
  similar: Product[];
  fallbackImg: string;
};

export default function ProductDetailClient({
  product,
  images,
  availabilityLabel,
  similar,
  fallbackImg,
}: Props) {
  // Normalizamos a arrays siempre
  const colorVariants: ColorVariant[] = Array.isArray(product.color_variants)
    ? product.color_variants
    : [];

  const sizeVariants: SizeVariant[] = Array.isArray(product.size_variants)
    ? product.size_variants
    : [];

  const [selectedColorName, setSelectedColorName] = useState<string | null>(
    colorVariants[0]?.name ?? null
  );

  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(
    sizeVariants[0]?.name ?? null
  );

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  const isSizeBased = sizeVariants.length > 0;

  const activeVariant =
    colorVariants.find((cv) => cv.name === selectedColorName) ?? null;

  const activeSize =
    sizeVariants.find((sv) => sv.name === selectedSizeName) ??
    (sizeVariants[0] ?? null);

  // Imágenes: primero tamaño, luego color, luego base
  const currentImages =
    (isSizeBased &&
      activeSize?.images &&
      activeSize.images.length > 0 &&
      activeSize.images) ||
    (activeVariant?.images && activeVariant.images.length > 0
      ? activeVariant.images
      : images);

  // Resetear índice cuando cambia color o tamaño
  useEffect(() => {
    setSelectedImgIndex(0);
  }, [selectedColorName, selectedSizeName]);

  // Cerrar modal con ESC
  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const mainImage = currentImages[selectedImgIndex] ?? fallbackImg;

  // Precio según tamaño (si trae) o precio base del producto
  const displayPrice =
    isSizeBased && activeSize?.price != null
      ? activeSize.price
      : product.price;

  // features -> array de líneas
  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const featurePreview = featuresExpanded ? featureLines : featureLines.slice(0, 5);
  const hasMoreFeatures = featureLines.length > 5;

  return (
    <>
      {/* ===== TÍTULO MOBILE ===== */}
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
              {currentImages.map((src, idx) => (
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

              {/* MINIATURAS MOBILE */}
              <div className="flex gap-2 overflow-x-auto md:hidden">
                {currentImages.map((src, idx) => (
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
          {/* TÍTULO + DISPONIBILIDAD DESKTOP */}
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

          {/* PRECIO + BOTONES CARRITO */}
          <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm space-y-3">
            <div className="space-y-1">
              {product.old_price && (
                <p className="text-sm text-neutral-400 line-through">
                  S/ {product.old_price}
                </p>
              )}
              <p className="text-3xl font-semibold text-red-600">
                S/ {displayPrice}
              </p>
              <p className="text-xs text-neutral-500">
                Precio incluye IGV. Stock sujeto a confirmación.
              </p>
            </div>

            <ProductAddToCart
              id={product.id}
              name={product.name}
              price={displayPrice ?? 0}
              mainImage={currentImages[0] ?? product.main_image_url ?? fallbackImg}
              size={isSizeBased ? selectedSizeName : null}
              color={isSizeBased ? null : selectedColorName ?? null}
            />
          </div>

          {/* TAMAÑOS (árboles) */}
          {sizeVariants.length > 0 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-800">
                  Tamaños disponibles
                </h3>
                {selectedSizeName && (
                  <p className="text-xs text-neutral-500">
                    Tamaño seleccionado:{" "}
                    <span className="font-medium text-neutral-800">
                      {selectedSizeName}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {sizeVariants.map((sv) => {
                  const isActive = selectedSizeName === sv.name;
                  return (
                    <button
                      key={sv.name}
                      type="button"
                      onClick={() => setSelectedSizeName(sv.name)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition
                        ${
                          isActive
                            ? "border-black bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                        }`}
                    >
                      {sv.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* COLORES (solo si no hay tamaños) */}
          {sizeVariants.length === 0 && colorVariants.length > 0 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-800">
                  Colores disponibles
                </h3>
                {selectedColorName && (
                  <p className="text-xs text-neutral-500">
                    Color seleccionado:{" "}
                    <span className="font-medium text-neutral-800">
                      {selectedColorName}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {colorVariants.map((cv) => {
                  const isActive = selectedColorName === cv.name;
                  return (
                    <button
                      key={cv.name}
                      type="button"
                      onClick={() => setSelectedColorName(cv.name)}
                      className={`relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition
                        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black
                        ${
                          isActive
                            ? "border-black bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                        }`}
                    >
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-black/10"
                        style={{
                          background:
                            cv.hex ||
                            "linear-gradient(135deg,#f5f5f5 0%,#e5e5e5 100%)",
                        }}
                      />
                      <span className="capitalize">{cv.name}</span>

                      {isActive && (
                        <span className="ml-1 inline-flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
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
                  {featuresExpanded ? "Ver menos" : "Ver todas las características"}
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
