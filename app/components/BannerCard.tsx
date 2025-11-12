"use client";

import Image from "next/image";

type Props = {
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
  priority?: boolean;
};

export default function BannerCard({ alt, desktopSrc, mobileSrc, priority }: Props) {
  return (
    <div className="relative h-[220px] md:h-[260px] lg:h-[320px] w-full overflow-hidden rounded-xl bg-neutral-100">
      {/* Mobile */}
      <Image
        src={mobileSrc}
        alt={alt}
        fill
        className="object-cover md:hidden"
        sizes="100vw"
        priority={priority}
      />
      {/* Desktop/Tablet */}
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        className="hidden md:block object-cover"
        sizes="(max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
}
