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

// 🔥 Convierte cualquier URL vieja → CDN estable
function toCdnUrl(url: string): string {
  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  if (!CDN_BASE) return url;

  const cleanCdn = CDN_BASE.replace(/\/$/, "");

  // 1️⃣ r2.dev → cdn.tecnohouseperu.com
  if (url.startsWith("https://pub-060e2f29cf544718ba7c53345f2ab55a.r2.dev/")) {
    return url.replace(
      "https://pub-060e2f29cf544718ba7c53345f2ab55a.r2.dev",
      cleanCdn
    );
  }

  // 2️⃣ Supabase public storage → cdn.tecnohouseperu.com
  const marker = "/storage/v1/object/public/";
  const i = url.indexOf(marker);
  if (i !== -1) {
    const pathAfter = url.substring(i + marker.length); // products/...
    return `${cleanCdn}/${pathAfter}`;
  }

  // 3️⃣ Ya es CDN (o cualquier otra URL válida)
  return url;
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
  const safeSrc: string =
    trimmed.length > 0 ? toCdnUrl(trimmed) : FALLBACK;

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
