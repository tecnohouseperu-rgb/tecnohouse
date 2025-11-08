import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HERO = [
  {
    id: 1,
    img: "/banners/hero-1.jpg",
    alt: "AirPods 2da gen",
  },
  {
    id: 2,
    img: "/banners/hero-2.jpg",
    alt: "iPad oferta",
  },
  {
    id: 3,
    img: "/banners/hero-3.jpg",
    alt: "Cool Days",
  },
];

export default function HomePage() {
  return (
    <main className="pb-16">
      {/* HERO - carrusel con scroll-snap */}
      <section className="mt-2">
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 lg:px-8 py-2">
            {HERO.map((b) => (
              <div
                key={b.id}
                className="min-w-[85%] md:min-w-[48%] lg:min-w-[33%] snap-start"
              >
                <div className="relative h-[220px] md:h-[260px] lg:h-[320px] w-full overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={b.img}
                    alt={b.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, (max-width: 1200px) 48vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tres bloques principales */}
      <section className="px-4 lg:px-8 mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ofertas bombas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-40 bg-neutral-100 rounded-lg" />
            <Button asChild className="w-full">
              <Link href="/ofertas">Ver ofertas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-40 bg-neutral-100 rounded-lg" />
            <Button asChild className="w-full" variant="secondary">
              <Link href="/tendencias">Ver todo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lo más vendido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-40 bg-neutral-100 rounded-lg" />
            <Button asChild className="w-full" variant="outline">
              <Link href="/mas-vendido">Ver todo</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Rejilla de categorías destacadas */}
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
