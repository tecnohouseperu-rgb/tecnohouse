// app/categorias/[...slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import CategoryClient from "./CategoryClient";

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

      {/* GRID + PAGINACIÓN (cliente) */}
      <CategoryClient products={products} fallbackImg={FALLBACK_IMG} />
    </div>
  );
}
