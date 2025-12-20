import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // mismo import que usas en otras partes

// Escapar valores para CSV
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = createClient();

  // 👇 AJUSTADO a tu tabla public.products
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      main_image_url,
      image_url,
      description,
      brand,
      tags,
      subcategory_slug,
      availability,
      stock,
      is_active
    `
    )
    .eq("subcategory_slug", "navidad")   // productos de Navidad
    .eq("is_active", true);              // solo activos

  if (error) {
    console.error("Supabase error feed navidad:", error);
    // ⚠️ MOSTRAMOS EL MENSAJE PARA DEBUG
    return new NextResponse(
      `Error Supabase al generar feed: ${error.message}`,
      { status: 500 }
    );
  }

  const products = data ?? [];

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "google_product_category",
  ].join(",");

  const rows = products.map((p) => {
    const priceNumber =
      typeof p.price === "number" ? p.price : Number(p.price ?? 0);

    const priceString =
      priceNumber && !Number.isNaN(priceNumber)
        ? `${priceNumber.toFixed(2)} PEN`
        : "";

    const link = `https://www.tecnohouseperu.com/producto/${p.slug}`;

    // si main_image_url está vacío, usamos image_url
    const imageUrl = p.main_image_url || p.image_url || "";

    // availability de Supabase lo convertimos a texto
    const availability =
      p.availability && typeof p.availability === "string"
        ? p.availability
        : "in stock";

    return [
      escapeCsv(p.id),
      escapeCsv(p.name),
      escapeCsv(p.description || p.name),
      escapeCsv(availability),
      escapeCsv("new"),
      escapeCsv(priceString),
      escapeCsv(link),
      escapeCsv(imageUrl),
      escapeCsv(p.brand || "TecnoHouse Perú"),
      escapeCsv("Home & Garden > Holiday & Seasonal Decor"),
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="facebook-navidad-feed.csv"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
