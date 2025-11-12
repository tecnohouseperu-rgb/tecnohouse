import Image from "next/image";
import Link from "next/link";
import BannerCard from "./components/BannerCard";

// 3 banners: Audio (ya subido), Navidad, iPhones
const BANNERS = [
  {
    id: 1,
    alt: "Súper ofertas de Audio",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/banner-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/banner-mobile.jpg",
  },
  {
    id: 2,
    alt: "Navidad - Regala magia",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/navidad-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/navidad-mobile.jpg",
  },
  {
    id: 3,
    alt: "iPhone - Estrena hoy",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/iphone-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/iphone-mobile.jpg",
  },
];

// Banners secundarios (debajo del hero)
const SECONDARY = [
  {
    id: 1,
    title: "Televisores",
    href: "/categorias/tv-video/televisores",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/secondary/tv-banner4.jpg",
    alt: "Ofertas en televisores",
  },
  {
    id: 2,
    title: "Mundo Bebé",
    href: "/categorias/bebe",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/secondary/banner-bebe.jpg",
    alt: "Mundo bebé",
  },
  {
    id: 3,
    title: "Lo más vendido",
    href: "/mas-vendido",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/secondary/banner-masvendido.webp",
    alt: "Top ventas",
  },
];

export default function HomePage() {
  return (
    <main className="pb-16">
      {/* HERO - carrusel con scroll-snap */}
      <section className="mt-2">
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 lg:px-8 py-2">
            {BANNERS.map((b, idx) => (
              <div
                key={b.id}
                className="min-w-[85%] md:min-w-[48%] lg:min-w-[33%] snap-start"
              >
                <BannerCard
                  alt={b.alt}
                  desktopSrc={b.desktop}
                  mobileSrc={b.mobile}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNERS SECUNDARIOS */}
      <section className="px-4 lg:px-8 mt-6 grid gap-6 md:grid-cols-3">
        {SECONDARY.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="block overflow-hidden rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <div className="relative w-full h-[180px] md:h-[200px] lg:h-[220px] bg-neutral-100">
              <Image
                src={b.img}
                alt={b.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            <div className="p-3 text-center font-medium text-sm md:text-base">
              {b.title}
            </div>
          </Link>
        ))}
      </section>

      {/* Rejilla de categorías destacadas (tu código) */}
      <section className="px-4 lg:px-8 mt-10">
        <h2 className="text-lg font-semibold mb-4">Explora por categoría</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            { name: "Audio", href: "/c/audio/audifonos" },
            { name: "Celulares", href: "/c/celulares/celulares" },
            { name: "Gamer", href: "/c/gamer/consolas" },
            { name: "Cómputo", href: "/c/computo/laptops-accesorios" },
            { name: "Smart Home", href: "/c/smarthome/convertidores" },
            { name: "TV y Video", href: "/c/tv-video/televisores" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="rounded-xl border p-4 hover:shadow-sm transition bg-white"
            >
              <div className="h-20 rounded-md bg-neutral-100 mb-3" />
              <div className="font-medium">{cat.name}</div>
              <div className="text-sm text-neutral-600">Ver productos</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
