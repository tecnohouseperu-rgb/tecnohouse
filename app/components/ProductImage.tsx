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
  const safeSrc = src && src.trim().length > 0 ? src : FALLBACK;

  // ✅ Soportar modo fill
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
