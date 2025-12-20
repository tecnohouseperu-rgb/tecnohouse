// app/api/facebook-navidad-feed/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // ajusta si tu ruta es distinta

// Escapar textos para CSV
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // si tiene comas, comillas o saltos de línea, lo rodeamos con comillas
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = createClient();

  // TODO: ajusta el nombre de la tabla y el filtro de categoría según tu esquema
  const { data: products, error } = await supabase
    .from("products") // o el nombre real de tu tabla
    .select(
      "id, name, slug, price, main_image_url, description, brand, category_slug"
    )
    .eq("category_slug", "navidad"); // o usa tags, etc.

  if (error) {
    console.error("Error obteniendo productos para feed:", error.message);
    return new NextResponse("Error al generar feed", { status: 500 });
  }

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

  const rows =
    products?.map((p) => {
      const priceString = p.price
        ? `${Number(p.price).toFixed(2)} PEN` // formato requerido por Meta: "39.40 PEN"
        : "";

      const link = `https://www.tecnohouseperu.com/producto/${p.slug}`;

      return [
        escapeCsv(p.id),
        escapeCsv(p.name),
        escapeCsv(p.description || p.name),
        escapeCsv("in stock"), // puedes cambiar según tu lógica
        escapeCsv("new"),
        escapeCsv(priceString),
        escapeCsv(link),
        escapeCsv(p.main_image_url),
        escapeCsv(p.brand || "TecnoHouse Perú"),
        escapeCsv("Home & Garden > Holiday & Seasonal Decor"), // opcional, puedes cambiar
      ].join(",");
    }) || [];

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="facebook-navidad-feed.csv"',
      "Cache-Control": "public, max-age=3600", // cache 1h
    },
  });
}
