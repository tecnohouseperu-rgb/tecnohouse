"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomeBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 🔗 Rutas desde Supabase Storage
  const mobileBanner =
    "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/banner-mobile.jpg";
  const desktopBanner =
    "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/banner-desktop.webp"; // si aún no tienes este, puedes dejar temporalmente el mismo URL del móvil

  const bannerUrl = isMobile ? mobileBanner : desktopBanner;

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-md">
      <Image
        src={bannerUrl}
        alt="Banner principal TecnoHouse Perú"
        width={1440}
        height={720}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}
