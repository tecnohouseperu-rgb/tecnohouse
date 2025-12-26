import Link from "next/link";
import BannerCard from "./components/BannerCard";
import { ProductImage } from "./components/ProductImage";

// 3 banners: Audio, Navidad, iPhones
const BANNERS = [
  {
    id: 1,
    alt: "Súper ofertas de Audio",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/banner-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/banner-mobile.jpg",
    href: "/categorias/audio", // 👈 categoría Audio
  },
  {
    id: 2,
    alt: "Navidad - Regala magia",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/navidad-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/navidad-mobile.jpg",
    href: "/categorias/navidad", // 👈 categoría Navidad
  },
  {
    id: 3,
    alt: "iPhone - Estrena hoy",
    desktop:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/desktop/iphone-desktop.jpg",
    mobile:
      "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/mobile/iphone-mobile.jpg",
    href: "/categorias/celulares/celulares", // 👈 iPhones / celulares
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
    title: "Crocs",
    href: "/categorias/crocs",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/banners/secondary/banner-crocs2.jpg",
    alt: "Top ventas",
  },
];

// ✅ CATEGORÍAS CON MINIBANNERS
const CATEGORIES = [
  {
    name: "Audio",
    href: "/categorias/audio",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/audio2.jpg",
  },
  {
    name: "Celulares",
    href: "/categorias/celulares/celulares",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/celulares2.jpg",
  },
  {
    name: "Gamer",
    href: "/categorias/gamer",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/gamer2.jpg",
  },
  {
    name: "Cómputo",
    href: "/categorias/computo",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/computo2.jpg",
  },
  {
    name: "Smart Home",
    href: "/categorias/smart-home",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/smart-home.jpg",
  },
  {
    name: "TV y Video",
    href: "/categorias/tv-video",
    img: "https://nelyvuxwskmqwtcmystn.supabase.co/storage/v1/object/public/categories/tv-video3.jpg",
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
                  href={b.href}
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
              <ProductImage
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

      {/* ✅ Rejilla de categorías destacadas con minibanners */}
      <section className="px-4 lg:px-8 mt-10">
        <h2 className="text-lg font-semibold mb-4">Explora por categoría</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="rounded-xl border hover:shadow-md transition bg-white overflow-hidden"
            >
              <div className="relative h-24 md:h-28 lg:h-32">
                <ProductImage
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
              </div>
              <div className="p-2 text-center">
                <div className="font-medium">{cat.name}</div>
                <div className="text-sm text-neutral-600">Ver productos</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
