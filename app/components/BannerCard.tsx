"use client";

import Link from "next/link";
import { ProductImage } from "@/app/components/ProductImage";

type Props = {
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
  href?: string;      
  priority?: boolean;
};

export default function BannerCard({
  alt,
  desktopSrc,
  mobileSrc,
  href,
  priority,
}: Props) {
  const content = (
    <div className="relative h-[220px] md:h-[260px] lg:h-[320px] w-full overflow-hidden rounded-xl bg-neutral-100">
      {/* Mobile */}
      <ProductImage
        src={mobileSrc || "/placeholder-banner.png"}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover md:hidden"
        priority={priority}
      />

      {/* Desktop */}
      <ProductImage
        src={desktopSrc || "/placeholder-banner.png"}
        alt={alt}
        fill
        sizes="(max-width: 1200px) 50vw, 33vw"
        className="hidden md:block object-cover"
        priority={priority}
      />
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
