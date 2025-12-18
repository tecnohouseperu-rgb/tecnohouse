// app/buscar/page.tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ProductImage } from "@/app/components/ProductImage";

type Props = {
  // 👇 ahora es una Promise, como lo está manejando Next
  searchParams: Promise<{ q?: string }>;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  main_image_url: string | null;
  price: number | null;
  old_price: number | null;
  brand: string | null;
};

export default async function BuscarPage({ searchParams }: Props) {
  // 👇 desempaquetamos la Promise
  const params = await searchParams;
  const rawQ = (params.q || "").trim();

  if (!rawQ) {
    return (
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">Buscar productos</h1>
        <p className="text-sm text-muted-foreground">
          Escribe algo en la barra de búsqueda para ver resultados.
        </p>
      </main>
    );
  }

  // Normalizamos la búsqueda: varias palabras, incompletas, etc.
  // Ej: "divoom parl" -> "%divoom%parl%"
  const words = rawQ
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const pattern = `%${words.join("%")}%`;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, main_image_url, price, old_price, brand")
    .or(`name.ilike.${pattern},brand.ilike.${pattern}`)
    .eq("is_active", true)
    .limit(60);

  if (error) {
    console.error("Error buscando productos:", error);
    return (
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Resultados para &quot;{rawQ}&quot;
        </h1>
        <p className="text-sm text-red-600">
          Ocurrió un error al buscar los productos. Inténtalo nuevamente.
        </p>
      </main>
    );
  }

  const products = (data || []) as Product[];

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          Resultados para &quot;{rawQ}&quot;
        </h1>
        <p className="text-sm text-muted-foreground">
          {products.length === 0
            ? "No encontramos productos que coincidan con tu búsqueda."
            : `${products.length} producto${
                products.length === 1 ? "" : "s"
              } encontrado${products.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {products.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group rounded-2xl border bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="relative w-full pt-[100%] bg-neutral-50">
                <ProductImage
                  src={p.main_image_url || "/placeholder-product.png"}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 20vw, 50vw"
                  className="object-contain p-2 group-hover:scale-[1.03] transition-transform"
                />
              </div>

              <div className="px-3 pb-3 pt-2 flex flex-col gap-1">
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {p.brand || "TecnoHouse"}
                </p>
                <h2 className="text-sm font-medium line-clamp-2">{p.name}</h2>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-base font-semibold text-red-600">
                    {p.price !== null ? `S/ ${p.price.toFixed(2)}` : "S/ —"}
                  </span>

                  {p.old_price && (
                    <span className="text-xs text-neutral-400 line-through">
                      S/ {p.old_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
