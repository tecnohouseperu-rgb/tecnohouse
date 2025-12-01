// app/categorias/[...slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
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

type PageProps = {
  params: Promise<{ slugs?: string[] }>;
};

const FALLBACK_IMG = "/placeholder-product.png";

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

export default async function CategoryPage({ params }: PageProps) {
  const supabase = createClient();

  const resolvedParams = await params;
  const segments = resolvedParams.slugs ?? [];
  const currentSlug = segments[segments.length - 1] ?? "";

  if (!currentSlug) {
    return (
      <div className="px-4 lg:px-10 py-5">
        <h1 className="text-xl font-semibold">Categoría</h1>
        <p className="mt-2 text-sm text-neutral-500">
          No se encontró la categoría.
        </p>
      </div>
    );
  }

  let products: Product[] = [];
  let titleFromDb: string | null = null;

  // 1) Primero probamos como SUBCATEGORÍA
  const { data: subcat } = await supabase
    .from("subcategories")
    .select("id, name")
    .eq("slug", currentSlug)
    .maybeSingle();

  if (subcat?.id) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("subcategory_id", subcat.id)
      .eq("is_active", true);

    products = (data as Product[]) ?? [];
    titleFromDb = subcat.name;
  } else {
    // 2) Si no, como CATEGORÍA
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", currentSlug)
      .maybeSingle();

    if (cat?.id) {
      const { data: subs } = await supabase
        .from("subcategories")
        .select("id")
        .eq("category_id", cat.id);

      const subIds = (subs ?? []).map((s) => s.id);

      if (subIds.length > 0) {
        const { data } = await supabase
          .from("products")
          .select("*")
          .in("subcategory_id", subIds)
          .eq("is_active", true);

        products = (data as Product[]) ?? [];
      }

      titleFromDb = cat.name;
    }
  }

  const prettyTitle =
    titleFromDb ||
    (currentSlug ? currentSlug.replace(/-/g, " ") : "Categoría");

  return (
    <div className="px-4 lg:px-10 py-4">
      {/* HEADER */}
      <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold capitalize">{prettyTitle}</h1>

        <span className="text-xs text-neutral-500">
          {products.length} producto
          {products.length === 1 ? "" : "s"}
        </span>
      </header>

      {/* GRID DE PRODUCTOS (SIN FILTROS) */}
      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aún no hay productos configurados para esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* IMAGEN */}
              <div className="relative w-full bg-neutral-50 aspect-square">
                <Image
                  src={getProductImageSrc(p.main_image_url)}
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
      )}
    </div>
  );
}
