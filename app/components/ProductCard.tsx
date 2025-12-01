"use client";

import Image from "next/image";
import Link from "next/link";

type Availability = "web" | "store-web";

type ProductCardProps = {
  href: string;              // link al detalle
  name: string;
  price: number;             // precio actual
  oldPrice?: number | null;  // precio antes (opcional)
  imageUrl: string;
  availability?: Availability;
  tags?: string[];           // ["nuevo", "oferta", "top", ...]
};

function formatPrice(value: number) {
  return `S/ ${value.toFixed(2)}`;
}

export default function ProductCard({
  href,
  name,
  price,
  oldPrice,
  imageUrl,
  availability,
  tags = [],
}: ProductCardProps) {
  const hasDiscount = oldPrice && oldPrice > price;

  const availabilityLabel =
    availability === "web"
      ? "Solo web"
      : availability === "store-web"
      ? "Tienda y web"
      : null;

  const availabilityClass =
    availability === "web"
      ? "bg-purple-100 text-purple-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <Link
      href={href}
      className="group rounded-xl border bg-white overflow-hidden hover:shadow-lg transition flex flex-col"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-neutral-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain p-3 group-hover:scale-[1.03] transition-transform"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2 px-3 pt-3 pb-4">
        {/* Nombre */}
        <h3 className="text-sm md:text-[15px] font-medium line-clamp-2">
          {name}
        </h3>

        {/* Precios */}
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base md:text-lg font-semibold text-orange-600">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-500 line-through">
                {formatPrice(oldPrice!)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold">
              Ahorra {formatPrice(oldPrice! - price)}
            </span>
          )}
        </div>

        {/* Chips */}
        <div className="mt-2 flex flex-wrap gap-1">
          {availabilityLabel && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${availabilityClass}`}
            >
              {availabilityLabel}
            </span>
          )}

          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 text-sky-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA simple (luego podemos cambiarlo por “Añadir al carrito”) */}
        <div className="mt-auto pt-2">
          <span className="inline-flex items-center text-[13px] font-medium text-blue-600 group-hover:text-blue-700">
            Ver producto
          </span>
        </div>
      </div>
    </Link>
  );
}
