import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Escapar valores CSV
function escapeCsv(value: any) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      main_image_url,
      image_url,
      description,
      brand,
      stock,
      availability,
      is_active
    `)
    .eq("is_active", true);   // SOLO este filtro

  if (error) {
    console.error("Supabase error feed navidad:", error);
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
    const priceNumber = Number(p.price ?? 0);
    const priceString =
      !Number.isNaN(priceNumber) ? `${priceNumber.toFixed(2)} PEN` : "";

    const link = `https://www.tecnohouseperu.com/producto/${p.slug}`;
    const imageUrl = p.main_image_url || p.image_url || "";

    return [
      escapeCsv(p.id),
      escapeCsv(p.name),
      escapeCsv(p.description || p.name),
      escapeCsv("in stock"),
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
      "Cache-Control": "no-store",
    },
  });
}
