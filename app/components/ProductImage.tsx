"use client";

import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

const FALLBACK = "/placeholder-product.png";

// ✅ Siempre devuelve string (nunca null/undefined)
function toCdnUrl(url: string): string {
  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE_URL;

  // Si no hay CDN, devuelve igual
  if (!CDN_BASE) return url;

  const marker = "/storage/v1/object/public/";
  const i = url.indexOf(marker);

  // Si no es Supabase, no tocar
  if (i === -1) return url;

  const pathAfter = url.substring(i + marker.length); // "products/..."
  return `${CDN_BASE.replace(/\/$/, "")}/${pathAfter}`;
}

export function ProductImage({
  src,
  alt,
  className,
  width = 900,
  height = 900,
  priority = false,
  sizes,
  fill = false,
}: Props) {
  const trimmed = (src ?? "").trim();
  const safeSrc: string = trimmed.length > 0 ? toCdnUrl(trimmed) : FALLBACK;

  if (fill) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
