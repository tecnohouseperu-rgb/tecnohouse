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
  name: string;
  code?: string;
  price?: number;
  images?: string[];
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

// Tallas base
const ADULT_SIZES = ["S", "M", "L", "XL", "XXL"];
const KID_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

type FamilySizeState = {
  adults: (string | null)[];
  kids: (string | null)[];
};

type ComboSizeState = (string | null)[];
type PieceType = "adult" | "kid" | null;

// Pijamas “antiguas”: packs del tipo 2 adultos + 2 niños, etc.
function getFamilyConfig(
  code?: string | null
): { adults: number; kids: number } | null {
  if (!code) return null;

  switch (code) {
    case "adult_unit":
      return { adults: 1, kids: 0 };
    case "adult_pair":
      return { adults: 2, kids: 0 };
    case "kid_unit":
      return { adults: 0, kids: 1 };
    case "kid_pair":
      return { adults: 0, kids: 2 };
    case "pack_2a1n":
      return { adults: 2, kids: 1 };
    case "pack_2a2n":
      return { adults: 2, kids: 2 };
    case "pack_1a1n":
      return { adults: 1, kids: 1 };
    default:
      return null;
  }
}

// Pijamas nuevas tipo “unidad / pack x2 / pack x3”
function getComboPieces(code?: string | null): number | null {
  if (!code) return null;

  switch (code) {
    case "unit":
      return 1;
    case "pack_2":
      return 2;
    case "pack_3":
      return 3;
    default:
      return null;
  }
}

export default function ProductDetailClient({
  product,
  images,
  availabilityLabel,
  similar,
  fallbackImg,
}: Props) {
  const colorVariants: ColorVariant[] = Array.isArray(product.color_variants)
    ? product.color_variants
    : [];

  const sizeVariants: SizeVariant[] = Array.isArray(product.size_variants)
    ? product.size_variants
    : [];

  // 👉 Detectamos si es un producto de pijamas familiares
  const isFamilyPajama = product.slug.toLowerCase().includes("pijama");

  // 👉 Color inteligente:
  // - 0 colores: null
  // - 1 color: lo selecciona automáticamente
  // - 2+ colores: empieza sin selección hasta que el cliente elija
  const [selectedColorName, setSelectedColorName] = useState<string | null>(
    colorVariants.length === 1 ? colorVariants[0].name : null
  );

  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(
    sizeVariants[0]?.name ?? null
  );

  // 👉 Estados de tallas
  const [familySizes, setFamilySizes] = useState<FamilySizeState>({
    adults: [],
    kids: [],
  }); // para pijamas antiguas

  const [comboSizes, setComboSizes] = useState<ComboSizeState>([]); // para pijamas nuevas “libres”
  const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]); // adulto/niño por prenda (solo packs nuevos)

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  // Guía de tallas (solo ropa/pijamas)
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<"adult" | "kid">("adult");

  const showSizeGuide = isFamilyPajama || product.tags?.includes("tallas");

  const isSizeBased = sizeVariants.length > 0;

  const activeVariant =
    colorVariants.find((cv) => cv.name === selectedColorName) ?? null;

  const activeSize =
    sizeVariants.find((sv) => sv.name === selectedSizeName) ??
    (sizeVariants[0] ?? null);

  // ======== TIPOS DE PIJAMA ========
  const familyConfig = getFamilyConfig(activeSize?.code ?? null);
  const comboPieces = getComboPieces(activeSize?.code ?? null);

  const isOldFamilyPack =
    isFamilyPajama && isSizeBased && familyConfig !== null;
  const isFreeComboPajama =
    isFamilyPajama &&
    isSizeBased &&
    familyConfig === null &&
    comboPieces !== null;

  // ========= CONFIGURAMOS PACKS ANTIGUOS (adultos / niños fijos) =========
  useEffect(() => {
    if (!isOldFamilyPack) {
      setFamilySizes({ adults: [], kids: [] });
      return;
    }

    const cfg = getFamilyConfig(activeSize?.code ?? null);
    if (!cfg) {
      setFamilySizes({ adults: [], kids: [] });
      return;
    }

    setFamilySizes((prev) => {
      const newAdults = Array.from(
        { length: cfg.adults },
        (_, i) => prev.adults[i] ?? null
      );
      const newKids = Array.from(
        { length: cfg.kids },
        (_, i) => prev.kids[i] ?? null
      );
      return { adults: newAdults, kids: newKids };
    });
  }, [isOldFamilyPack, activeSize?.code]);

  // ========= CONFIGURAMOS PACKS NUEVOS (combo x2, x3, etc) =========
  useEffect(() => {
    if (!isFreeComboPajama || !comboPieces) {
      setComboSizes([]);
      setPieceTypes([]);
      return;
    }

    setComboSizes((prev) =>
      Array.from({ length: comboPieces }, (_, i) => prev[i] ?? null)
    );

    setPieceTypes((prev) =>
      Array.from({ length: comboPieces }, (_, i) => prev[i] ?? null)
    );
  }, [isFreeComboPajama, comboPieces, activeSize?.code]);

  // ========= IMÁGENES =========
  // Prioridad: imágenes por talla -> imágenes por color -> imágenes generales
  const currentImages =
    (isSizeBased && activeSize?.images?.length ? activeSize.images : null) ||
    (activeVariant?.images?.length ? activeVariant.images : null) ||
    images;

  useEffect(() => {
    setSelectedImgIndex(0);
  }, [selectedColorName, selectedSizeName]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const mainImage = currentImages[selectedImgIndex] ?? fallbackImg;

  const displayPrice =
    isSizeBased && activeSize?.price != null
      ? activeSize.price
      : product.price;

  // ========= TEXTO QUE VA AL CARRITO EN EL CAMPO size =========
  const sizeLabelForCart: string | null = (() => {
    if (!isSizeBased) return null;

    const baseName = activeSize?.name ?? selectedSizeName ?? "";
    if (!baseName) return null;

    if (!isFamilyPajama) {
      // Árboles / otros productos
      return baseName;
    }

    // Pijamas antiguas (packs con adultos / niños fijos)
    if (isOldFamilyPack) {
      const parts: string[] = [];

      familySizes.adults.forEach((sz, idx) => {
        if (sz) parts.push(`Adulto ${idx + 1}: ${sz}`);
      });
      familySizes.kids.forEach((sz, idx) => {
        if (sz) parts.push(`Niño ${idx + 1}: ${sz}`);
      });

      if (parts.length === 0) return baseName;
      return `${baseName} - ${parts.join(", ")}`;
    }

    // Pijamas nuevas “libres”: unidad, pack x2, pack x3...
    if (isFreeComboPajama) {
      const parts: string[] = [];
      comboSizes.forEach((sz, idx) => {
        if (sz) parts.push(`Prenda ${idx + 1}: ${sz}`);
      });
      if (parts.length === 0) return baseName;
      return `${baseName} - ${parts.join(", ")}`;
    }

    return baseName;
  })();

  // ========= FEATURES =========
  const featureLines = (product.features ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const featurePreview = featuresExpanded
    ? featureLines
    : featureLines.slice(0, 5);
  const hasMoreFeatures = featureLines.length > 5;

  // ========= HANDLERS TALLAS =========
  const handleAdultSizeClick = (index: number, size: string) => {
    setFamilySizes((prev) => {
      const nextAdults = [...prev.adults];
      nextAdults[index] = size;
      return { ...prev, adults: nextAdults };
    });
  };

  const handleKidSizeClick = (index: number, size: string) => {
    setFamilySizes((prev) => {
      const nextKids = [...prev.kids];
      nextKids[index] = size;
      return { ...prev, kids: nextKids };
    });
  };

  const handleComboSizeClick = (index: number, size: string) => {
    setComboSizes((prev) => {
      const next = [...prev];
      next[index] = size;
      return next;
    });
  };

  const handlePieceTypeSelect = (idx: number, type: PieceType) => {
    setPieceTypes((prev) => {
      const next = [...prev];
      next[idx] = type;
      return next;
    });

    // Cada vez que cambia el tipo, borrar talla seleccionada
    setComboSizes((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  const hasOldPackMembers =
    familySizes.adults.length > 0 || familySizes.kids.length > 0;
  const hasComboMembers = comboSizes.length > 0;

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
              mainImage={
                currentImages[0] ?? product.main_image_url ?? fallbackImg
              }
              size={sizeLabelForCart}
              // 👉 ahora siempre mandamos el color si existe,
              // incluso cuando hay size_variants
              color={selectedColorName ?? null}
            />
          </div>

          {/* OPCIONES / PACKS */}
          {sizeVariants.length > 0 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-800">
                  {isFamilyPajama ? "Opciones de compra" : "Tamaños disponibles"}
                </h3>
                {selectedSizeName && (
                  <p className="text-xs text-neutral-500">
                    Opción seleccionada:{" "}
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
                      onClick={() => {
                        setSelectedSizeName(sv.name);
                      }}
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

              {/* Pijamas antiguas: adultos / niños fijos */}
              {isFamilyPajama &&
                isOldFamilyPack &&
                hasOldPackMembers && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-700">
                      Selecciona la talla para cada integrante
                    </p>

                    {/* Adultos */}
                    {familySizes.adults.map((current, idx) => (
                      <div key={`adult-${idx}`} className="space-y-1">
                        <p className="text-[11px] font-medium text-neutral-700">
                          Adulto {idx + 1}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ADULT_SIZES.map((t) => {
                            const active = current === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleAdultSizeClick(idx, t)}
                                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition
                                  ${
                                    active
                                      ? "border-black bg-neutral-900 text-white shadow-sm"
                                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                                  }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Niños */}
                    {familySizes.kids.map((current, idx) => (
                      <div key={`kid-${idx}`} className="space-y-1">
                        <p className="text-[11px] font-medium text-neutral-700">
                          Niño {idx + 1}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {KID_SIZES.map((t) => {
                            const active = current === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleKidSizeClick(idx, t)}
                                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition
                                  ${
                                    active
                                      ? "border-black bg-neutral-900 text-white shadow-sm"
                                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                                  }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {showSizeGuide && (
                      <button
                        type="button"
                        onClick={() => {
                          setGuideTab("adult");
                          setShowGuide(true);
                        }}
                        className="mt-2 text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        Ver guía de tallas
                      </button>
                    )}

                    <p className="mt-1 text-[11px] text-neutral-500">
                      * Si necesitas combinaciones especiales, también puedes
                      detallarlas en comentarios o por WhatsApp luego del
                      pedido.
                    </p>
                  </div>
                )}

              {/* Pijamas nuevas: packs libres (unidad / pack x2 / pack x3) */}
              {isFamilyPajama &&
                isFreeComboPajama &&
                hasComboMembers && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-semibold text-neutral-700">
                      Selecciona si cada prenda es adulto o niño y su talla
                    </p>

                    {comboSizes.map((current, idx) => {
                      const pieceType = pieceTypes[idx];

                      return (
                        <div key={`combo-${idx}`} className="space-y-2">
                          <p className="text-[11px] font-medium text-neutral-700">
                            Prenda {idx + 1}
                          </p>

                          {/* Selector Adulto / Niño */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handlePieceTypeSelect(idx, "adult")
                              }
                              className={`px-3 py-1.5 rounded-full text-[11px] border transition ${
                                pieceType === "adult"
                                  ? "bg-neutral-900 text-white border-black"
                                  : "bg-white border-neutral-300 text-neutral-700"
                              }`}
                            >
                              Adulto
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePieceTypeSelect(idx, "kid")}
                              className={`px-3 py-1.5 rounded-full text-[11px] border transition ${
                                pieceType === "kid"
                                  ? "bg-neutral-900 text-white border-black"
                                  : "bg-white border-neutral-300 text-neutral-700"
                              }`}
                            >
                              Niño
                            </button>
                          </div>

                          {/* Mostrar tallas SOLO si eligió tipo */}
                          {pieceType && (
                            <>
                              <p className="text-[10px] text-neutral-500 mt-1">
                                Tallas (
                                {pieceType === "adult" ? "Adulto" : "Niño"})
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {(pieceType === "adult"
                                  ? ADULT_SIZES
                                  : KID_SIZES
                                ).map((t) => {
                                  const active = current === t;
                                  return (
                                    <button
                                      key={`${pieceType}-${t}-${idx}`}
                                      type="button"
                                      onClick={() =>
                                        handleComboSizeClick(idx, t)
                                      }
                                      className={`rounded-full border px-3 py-1 text-[11px] font-medium transition
                                        ${
                                          active
                                            ? "border-black bg-neutral-900 text-white shadow-sm"
                                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                                        }`}
                                    >
                                      {t}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {showSizeGuide && (
                      <button
                        type="button"
                        onClick={() => {
                          setGuideTab("adult");
                          setShowGuide(true);
                        }}
                        className="mt-2 text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        Ver guía de tallas
                      </button>
                    )}

                    <p className="mt-1 text-[11px] text-neutral-500">
                      * Puedes combinar tallas de adultos y niños como prefieras
                      dentro del pack.
                    </p>
                  </div>
                )}

              {/* Guía de tallas para ropa / pijamas simples (solo tallas, sin packs) */}
              {showSizeGuide && !isOldFamilyPack && !isFreeComboPajama && (
                <button
                  type="button"
                  onClick={() => {
                    setGuideTab("adult");
                    setShowGuide(true);
                  }}
                  className="mt-3 text-[11px] font-medium text-blue-600 hover:underline"
                >
                  Ver guía de tallas
                </button>
              )}
            </div>
          )}

          {/* COLORES (inteligente: solo selector si hay 2+ colores) */}
          {colorVariants.length > 1 && (
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

          {/* Si hay exactamente 1 color, lo mostramos como info y no como selector */}
          {colorVariants.length === 1 && (
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
              <p className="text-xs text-neutral-600">
                Color único:{" "}
                <span className="font-medium">{colorVariants[0].name}</span>
              </p>
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

      {/* MODAL GUÍA DE TALLAS (Premium) */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fadeIn"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                Guía de tallas
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
              >
                <X className="h-5 w-5 text-neutral-700" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 flex gap-2">
              <button
                onClick={() => setGuideTab("adult")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  guideTab === "adult"
                    ? "bg-neutral-900 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Adultos
              </button>
              <button
                onClick={() => setGuideTab("kid")}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  guideTab === "kid"
                    ? "bg-neutral-900 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Niños
              </button>
            </div>

            {/* Tabla adultos */}
            {guideTab === "adult" && (
              <div className="px-6 pb-6 space-y-3">
                <p className="text-xs text-neutral-500">
                  Las medidas pueden variar ligeramente según el fabricante.
                </p>

                <table className="w-full border-collapse text-sm rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-neutral-50 text-neutral-700">
                    <tr>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Talla
                      </th>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Pecho (cm)
                      </th>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Cintura (cm)
                      </th>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Altura (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "S", p: "82–88", c: "72–78", h: "155–165" },
                      { t: "M", p: "88–94", c: "78–84", h: "165–172" },
                      { t: "L", p: "94–100", c: "84–90", h: "172–178" },
                      { t: "XL", p: "100–106", c: "90–96", h: "178–184" },
                      { t: "XXL", p: "106–112", c: "96–102", h: "184–190" },
                    ].map((row, i) => (
                      <tr
                        key={row.t}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                        }
                      >
                        <td className="border border-neutral-100 px-3 py-2 font-medium">
                          {row.t}
                        </td>
                        <td className="border border-neutral-100 px-3 py-2">
                          {row.p}
                        </td>
                        <td className="border border-neutral-100 px-3 py-2">
                          {row.c}
                        </td>
                        <td className="border border-neutral-100 px-3 py-2">
                          {row.h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tabla niños */}
            {guideTab === "kid" && (
              <div className="px-6 pb-6 space-y-3">
                <p className="text-xs text-neutral-500">
                  Guía referencial según la edad y estatura.
                </p>

                <table className="w-full border-collapse text-sm rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-neutral-50 text-neutral-700">
                    <tr>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Talla
                      </th>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Edad aprox.
                      </th>
                      <th className="border border-neutral-100 px-3 py-2 font-semibold">
                        Altura (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "2", e: "2 años", h: "86–92" },
                      { t: "4", e: "3–4 años", h: "98–104" },
                      { t: "6", e: "5–6 años", h: "110–116" },
                      { t: "8", e: "7–8 años", h: "122–128" },
                      { t: "10", e: "9–10 años", h: "134–140" },
                      { t: "12", e: "11–12 años", h: "146–152" },
                      { t: "14", e: "13–14 años", h: "158–164" },
                      { t: "16", e: "15–16 años", h: "170–172" },
                    ].map((row, i) => (
                      <tr
                        key={row.t}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                        }
                      >
                        <td className="border border-neutral-100 px-3 py-2 font-medium">
                          {row.t}
                        </td>
                        <td className="border border-neutral-100 px-3 py-2">
                          {row.e}
                        </td>
                        <td className="border border-neutral-100 px-3 py-2">
                          {row.h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
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
