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

// 🔥 Convierte URL pública de Supabase → Cloudflare R2
function toCdnUrl(url?: string | null) {
  if (!url) return url;

  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  if (!CDN_BASE) return url;

  const marker = "/storage/v1/object/public/";
  const i = url.indexOf(marker);

  // Si no es Supabase, no tocar
  if (i === -1) return url;

  // Ej: products/audio/audifonos/imagen.jpg
  const pathAfter = url.substring(i + marker.length);

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
  const safeSrc =
    src && src.trim().length > 0 ? toCdnUrl(src) : FALLBACK;

  // ✅ Modo fill
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
