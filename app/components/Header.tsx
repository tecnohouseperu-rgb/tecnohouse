"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  MapPin,
  Store,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* helper opcional si no tienes utils/cn */
function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

/* =======================
   DATOS DEL MEGA MENÚ
   ======================= */

type MegaItem = { label: string; href: string };
type MegaGroup = { title: string; items: MegaItem[] };
type MegaCategory = {
  key: string;
  label: string;
  href: string;
  groups: MegaGroup[];
};

const MEGA_DATA: MegaCategory[] = [
  {
    key: "audio",
    label: "Audio",
    href: "/categorias/audio",
    groups: [
      {
        title: "Audífonos",
        items: [
          { label: "Bluetooth on ear", href: "/categorias/audio/audifonos/bluetooth-on-ear" },
          { label: "Bluetooth in ear", href: "/categorias/audio/audifonos/bluetooth-in-ear" },
          { label: "True Wireless", href: "/categorias/audio/audifonos/true-wireless" },
          { label: "Sin arnés con mic", href: "/categorias/audio/audifonos/sin-arnes-con-mic" },
          { label: "Con arnés con mic", href: "/categorias/audio/audifonos/con-arnes-con-mic" },
          { label: "Cancelación de ruido", href: "/categorias/audio/audifonos/cancelacion-ruido" },
          { label: "Manos libres", href: "/categorias/audio/audifonos/manos-libres" },
        ],
      },
      {
        title: "Parlantes",
        items: [
          { label: "Portátiles bluetooth", href: "/categorias/audio/parlantes/portatiles" },
          { label: "Parlantes torre", href: "/categorias/audio/parlantes/torre" },
          { label: "Parlantes karaoke", href: "/categorias/audio/parlantes/karaoke" },
          { label: "Smart", href: "/categorias/audio/parlantes/smart" },
          { label: "Para auto", href: "/categorias/audio/parlantes/auto" },
          { label: "Estuches & repuestos", href: "/categorias/audio/parlantes/accesorios" },
        ],
      },
      {
        title: "Micrófonos",
        items: [
          { label: "Convencionales", href: "/categorias/audio/microfonos/convencionales" },
          { label: "Inalámbricos", href: "/categorias/audio/microfonos/inalambricos" },
          { label: "De solapa", href: "/categorias/audio/microfonos/solapa" },
          { label: "Podcast", href: "/categorias/audio/microfonos/podcast" },
          { label: "Profesionales", href: "/categorias/audio/microfonos/profesionales" },
        ],
      },
      {
        title: "Accesorios de audio",
        items: [
          { label: "Adaptadores", href: "/categorias/audio/accesorios/adaptadores" },
          { label: "Baterías & power", href: "/categorias/audio/accesorios/baterias" },
          { label: "Cables", href: "/categorias/audio/accesorios/cables" },
          { label: "Interfaces de audio", href: "/categorias/audio/accesorios/interfaces" },
          { label: "Transmisores inalámbricos", href: "/categorias/audio/accesorios/transmisores" },
        ],
      },
      {
        title: "Radios / FRs / Accesorios",
        items: [
          { label: "Accesorios de radios", href: "/categorias/audio/radios/accesorios" },
          { label: "Radios FRS", href: "/categorias/audio/radios/frs" },
        ],
      },
      {
        title: "Barras & Equipos de sonido",
        items: [
          { label: "Equipo de sonido", href: "/categorias/audio/equipos/equipo" },
          { label: "Barras de sonido", href: "/categorias/audio/equipos/barras" },
        ],
      },
      {
        title: "Radios y Grabadoras de Voz",
        items: [
          { label: "Grabadoras de voz", href: "/categorias/audio/grabadoras" },
          { label: "Radios", href: "/categorias/audio/radios" },
        ],
      },
      {
        title: "Instrumentos Musicales",
        items: [
          { label: "Teclados & pianos", href: "/categorias/audio/instrumentos/teclados" },
          { label: "Guitarras eléctricas", href: "/categorias/audio/instrumentos/guitarras" },
          { label: "Pedales & amplificadores", href: "/categorias/audio/instrumentos/amplificadores" },
          { label: "Monitores de estudio", href: "/categorias/audio/instrumentos/monitores" },
        ],
      },
      {
        title: "Autoradios",
        items: [
          { label: "Con pantalla táctil", href: "/categorias/audio/autoradios/pantalla" },
          { label: "Sin pantalla táctil", href: "/categorias/audio/autoradios/sin-pantalla" },
        ],
      },
    ],
  },

  /* ==== A partir de acá, estructuras listas para llenar ==== */
  {
    key: "celulares",
    label: "Celulares y Accesorios",
    href: "/categorias/celulares",
    groups: [
      {
        title: "Celulares",
        items: [
          { label: "Gama alta", href: "/categorias/celulares/alta" },
          { label: "Gama media", href: "/categorias/celulares/media" },
          { label: "Gama de entrada", href: "/categorias/celulares/entrada" },
        ],
      },
      {
        title: "Accesorios",
        items: [
          { label: "Cargadores", href: "/categorias/celulares/accesorios/cargadores" },
          { label: "Baterías externas", href: "/categorias/celulares/accesorios/powerbank" },
          { label: "Cables", href: "/categorias/celulares/accesorios/cables" },
          { label: "Fundas & vidrio", href: "/categorias/celulares/accesorios/fundas" },
        ],
      },
      {
        title: "Wearables",
        items: [
          { label: "Relojes inteligentes", href: "/categorias/celulares/wearables/relojes" },
          { label: "Audífonos TWS", href: "/categorias/celulares/wearables/audifonos" },
        ],
      },
    ],
  },
  { key: "gamer", label: "Gamer", href: "/categorias/gamer", groups: [] },
  { key: "computo", label: "Cómputo", href: "/categorias/computo", groups: [] },
  { key: "smart-home", label: "Smart Home", href: "/categorias/smart-home", groups: [] },
  { key: "tv-video", label: "TV y Video", href: "/categorias/tv-video", groups: [] },
  { key: "electrohogar", label: "Electrohogar", href: "/categorias/electrohogar", groups: [] },
  { key: "deportes", label: "Deportes y Aire Libre", href: "/categorias/deportes", groups: [] },
  { key: "drones", label: "Drones", href: "/categorias/drones", groups: [] },
  { key: "fotografia", label: "Fotografía", href: "/categorias/fotografia", groups: [] },
  { key: "mascotas", label: "Mascotas", href: "/categorias/mascotas", groups: [] },
  { key: "jugueteria", label: "Juguetería", href: "/categorias/jugueteria", groups: [] },
  { key: "bebe", label: "Mundo Bebé", href: "/categorias/bebe", groups: [] },
  { key: "viajes", label: "Viajes", href: "/categorias/viajes", groups: [] },
  {
    key: "navidad",
    label: "Navidad",
    href: "/categorias/navidad",
    groups: [
      {
        title: "Temporada",
        items: [
          { label: "Árboles", href: "/categorias/navidad/arboles" },
          { label: "Pijamas adultos", href: "/categorias/navidad/pijamas-adultos" },
          { label: "Pijamas niños/niñas", href: "/categorias/navidad/pijamas-ninos" },
          { label: "Adornos", href: "/categorias/navidad/adornos" },
          { label: "Disfraces", href: "/categorias/navidad/disfraces" },
        ],
      },
    ],
  },
  {
    key: "crocs",
    label: "Crocs",
    href: "/categorias/crocs",
    groups: [
      {
        title: "Adultos",
        items: [{ label: "Ver adultos", href: "/categorias/crocs/adultos" }],
      },
      {
        title: "Niños",
        items: [{ label: "Ver niños", href: "/categorias/crocs/ninos" }],
      },
    ],
  },
];

/* Índice rápido por key */
const CATEGORY_INDEX = MEGA_DATA.reduce<Record<string, MegaCategory>>((acc, c) => {
  acc[c.key] = c;
  return acc;
}, {});

/* =======================
   HEADER
   ======================= */

export default function Header() {
  const [openMega, setOpenMega] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(MEGA_DATA[0].key);
  const [mobileDrawer, setMobileDrawer] = useState(false);

  const activeCategory = useMemo(() => CATEGORY_INDEX[activeKey], [activeKey]);

  /* cerrar mega al hacer scroll */
  useEffect(() => {
    const onScroll = () => setOpenMega(false);
    if (openMega) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, [openMega]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      {/* Barra utilitaria */}
      <div className="hidden md:flex items-center justify-between text-xs text-muted-foreground px-4 lg:px-6 h-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>Envíos en todo el Perú</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tiendas" className="hover:text-foreground flex items-center gap-1">
            <Store size={14} /> Nuestras Tiendas
          </Link>
          <Link href="/ayuda" className="hover:text-foreground flex items-center gap-1">
            <HelpCircle size={14} /> Ayuda
          </Link>
        </div>
      </div>

      {/* Barra principal */}
      <div className="px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Logo + Marca */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/tecnohouse.svg"   // usa tu SVG
              alt="TecnoHouse Perú"
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="text-lg md:text-xl font-semibold tracking-tight">
              TecnoHouse Perú
            </span>
          </Link>

          {/* Botón Categorías (desktop) */}
          <div className="hidden md:flex">
            <button
              onClick={() => setOpenMega((v) => !v)}
              className={cx(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
                "hover:bg-muted/70 transition"
              )}
            >
              <Menu size={18} />
              Categorías
              <ChevronDown
                size={16}
                className={cx("transition", openMega && "rotate-180")}
              />
            </button>
          </div>

          {/* Buscador (desktop) */}
          <form action="/buscar" className="flex-1 max-w-3xl mx-auto hidden md:flex">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                name="q"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 h-10 rounded-md border bg-background text-sm outline-none focus:ring-2 ring-primary/20"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Abre drawer en móvil */}
            <button
              onClick={() => setMobileDrawer(true)}
              className="md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Menu size={18} />
              Categorías
            </button>

            <Link
              href="/tiendas"
              aria-label="Tiendas"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Store size={18} />
              <span className="hidden lg:inline">Tiendas</span>
            </Link>

            <Link
              href="/ayuda"
              aria-label="Ayuda"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <HelpCircle size={18} />
              <span className="hidden lg:inline">Ayuda</span>
            </Link>

            <Link
              href="/carrito"
              aria-label="Carrito"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <ShoppingCart size={18} />
              <span className="hidden lg:inline">Carrito</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mega menú (DESKTOP) */}
      {openMega && (
        <div className="hidden md:block border-t bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-[240px_1fr] min-h-[420px]">
            {/* Columna izquierda: lista de categorías */}
            <aside className="border-r p-2">
              <ul className="space-y-1">
                {MEGA_DATA.map((cat) => (
                  <li key={cat.key}>
                    <button
                      className={cx(
                        "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted/70 transition",
                        activeKey === cat.key && "bg-muted/70 font-medium"
                      )}
                      onMouseEnter={() => setActiveKey(cat.key)}
                      onFocus={() => setActiveKey(cat.key)}
                      onClick={() => {
                        setOpenMega(false);
                      }}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Panel derecho: grupos + subcategorías */}
            <section className="p-4">
              {/* Título + Ver todo */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-semibold">
                  {activeCategory?.label}
                </h3>
                <Link
                  href={activeCategory?.href ?? "#"}
                  className="text-sm text-primary hover:underline"
                  onClick={() => setOpenMega(false)}
                >
                  Ver todo
                </Link>
              </div>

              {/* Grilla de grupos */}
              {activeCategory?.groups?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCategory.groups.map((group) => (
                    <div key={group.title}>
                      <p className="text-sm font-semibold mb-2 text-red-600">
                        {group.title}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((it) => (
                          <li key={it.href}>
                            <Link
                              href={it.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                              onClick={() => setOpenMega(false)}
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Próximamente subcategorías…
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Buscador en móvil */}
      <div className="md:hidden border-t">
        <div className="px-4 py-2">
          <form action="/buscar">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                name="q"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 h-10 rounded-md border bg-background text-sm outline-none focus:ring-2 ring-primary/20"
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      </div>

      {/* DRAWER MÓVIL */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* fondo */}
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileDrawer(false)}
            aria-label="Cerrar categorías"
          />

          {/* panel */}
          <div className="absolute inset-y-0 left-0 w-[92%] max-w-[420px] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-4 h-12">
              <span className="text-sm font-medium">Categorías</span>
              <button
                className="p-2 rounded-md hover:bg-muted/70"
                onClick={() => setMobileDrawer(false)}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-2">
              {/* Acordeones por categoría */}
              <ul className="space-y-2">
                {MEGA_DATA.map((cat, i) => (
                  <li key={cat.key} className="border rounded-md">
                    <details open={i === 0}>
                      <summary className="cursor-pointer list-none select-none px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{cat.label}</span>
                        <ChevronDown className="size-4" />
                      </summary>

                      {/* grupos */}
                      <div className="px-3 pb-2">
                        {cat.groups?.length ? (
                          <ul className="space-y-3">
                            {cat.groups.map((group) => (
                              <li key={group.title}>
                                <p className="text-xs font-semibold text-red-600 mb-1">
                                  {group.title}
                                </p>
                                <ul className="space-y-1">
                                  {group.items.map((it) => (
                                    <li key={it.href}>
                                      <Link
                                        href={it.href}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                        onClick={() => setMobileDrawer(false)}
                                      >
                                        {it.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Próximamente subcategorías…
                          </div>
                        )}

                        {/* link ver todo */}
                        <div className="pt-3">
                          <Link
                            href={cat.href}
                            className="text-xs text-primary hover:underline"
                            onClick={() => setMobileDrawer(false)}
                          >
                            Ver todo {cat.label}
                          </Link>
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
