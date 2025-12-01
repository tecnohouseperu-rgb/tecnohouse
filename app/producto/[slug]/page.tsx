// app/producto/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailClient from "./ProductDetailClient";

const FALLBACK_IMG = "/placeholder-product.png";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  old_price: number | null;
  main_image_url: string | null;
  gallery_urls: string[] | null;
  tags: string[] | null;
  is_active: boolean;
  subcategory_id: number | null;
  availability: string | null;
  description: string | null;
  features: string | null;
  attributes: Record<string, any> | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

// "color:Negro" -> "Negro"
function extractColorsFromTags(tags: string[] | null): string[] {
  if (!tags) return [];
  return tags
    .filter((t) => t.toLowerCase().startsWith("color:"))
    .map((t) => t.split(":")[1]?.trim())
    .filter(Boolean) as string[];
}

function getAvailabilityLabel(value: string | null): string {
  if (!value) return "Disponibilidad no especificada";
  const v = value.toLowerCase();
  if (v === "both" || v === "tienda-web") return "Disponible en tienda y web";
  if (v === "web") return "Solo web";
  if (v === "store" || v === "tienda") return "Solo en tienda física";
  return value;
}

function getImageSrc(url: string | null): string {
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

export default async function ProductPage({ params }: PageProps) {
  const supabase = createClient();
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      old_price,
      main_image_url,
      gallery_urls,
      tags,
      is_active,
      subcategory_id,
      availability,
      description,
      features,
      attributes
    `
    )
    .eq("slug", slug)
    .maybeSingle<Product>();

  if (error) {
    console.error("Error cargando producto:", error);
  }

  if (!product || !product.is_active) {
    return notFound();
  }

  const images: string[] = [
    product.main_image_url,
    ...(product.gallery_urls ?? []),
  ]
    .filter(Boolean)
    .map((u) => getImageSrc(u as string));

  const colors = extractColorsFromTags(product.tags ?? []);
  const availabilityLabel = getAvailabilityLabel(product.availability);

  // Productos similares (misma subcategoría)
  let similar: Product[] = [];
  if (product.subcategory_id) {
    const { data: sim } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        old_price,
        main_image_url,
        tags,
        is_active,
        subcategory_id
      `
      )
      .eq("subcategory_id", product.subcategory_id)
      .eq("is_active", true)
      .neq("id", product.id)
      .limit(10);

    similar = (sim as Product[]) ?? [];
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="px-4 lg:px-10 py-6 max-w-6xl mx-auto">
        {/* MIGAS / VOLVER */}
        <div className="mb-4 text-xs text-neutral-500">
          <Link href="/categorias/audio" className="hover:underline">
            Audio
          </Link>{" "}
          / <span className="text-neutral-700 line-clamp-1">{product.name}</span>
        </div>

        <ProductDetailClient
          product={product}
          images={images}
          colors={colors}
          availabilityLabel={availabilityLabel}
          similar={similar}
          fallbackImg={FALLBACK_IMG}
        />
      </div>
    </div>
  );
}
