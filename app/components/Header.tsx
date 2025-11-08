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

/* helper opcional */
function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

/* =======================
   DATOS (resumido)
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
  /* 1. AUDIO */
  {
    key: "audio",
    label: "Audio",
    href: "/categorias/audio",
    groups: [
      {
        title: "Audífonos",
        items: [{ label: "Ver todo Audífonos", href: "/categorias/audio/audifonos" }],
      },
      {
        title: "Parlantes",
        items: [{ label: "Ver todo Parlantes", href: "/categorias/audio/parlantes" }],
      },
      {
        title: "Micrófonos",
        items: [{ label: "Ver todo Micrófonos", href: "/categorias/audio/microfonos" }],
      },
    ],
  },

  /* 2. CELULARES Y ACCESORIOS */
  {
    key: "celulares",
    label: "Celulares y Accesorios",
    href: "/categorias/celulares",
    groups: [
      {
        title: "Celulares",
        items: [{ label: "Ver todo Celulares", href: "/categorias/celulares/celulares" }],
      },
      {
        title: "Relojes inteligentes",
        items: [{ label: "Ver todo Relojes inteligentes", href: "/categorias/celulares/relojes-inteligentes" }],
      },
      {
        title: "Cargadores",
        items: [{ label: "Ver todo Cargadores", href: "/categorias/celulares/cargadores" }],
      },
      {
        title: "Baterías externas",
        items: [{ label: "Ver todo Baterías externas", href: "/categorias/celulares/baterias-externas" }],
      },
      {
        title: "Cables",
        items: [{ label: "Ver todo Cables", href: "/categorias/celulares/cables" }],
      },
    ],
  },

  /* 3. GAMER */
  {
    key: "gamer",
    label: "Gamer",
    href: "/categorias/gamer",
    groups: [
      { title: "Consolas", items: [{ label: "Ver todo Consolas", href: "/categorias/gamer/consolas" }] },
      { title: "Juegos", items: [{ label: "Ver todo Juegos", href: "/categorias/gamer/juegos" }] },
      { title: "Laptops gamers", items: [{ label: "Ver todo Laptops gamers", href: "/categorias/gamer/laptops-gamers" }] },
      { title: "Mandos gamers", items: [{ label: "Ver todo Mandos gamers", href: "/categorias/gamer/mandos-gamers" }] },
      { title: "Sillas y mesas", items: [{ label: "Ver todo Sillas y mesas", href: "/categorias/gamer/sillas-y-mesas" }] },
    ],
  },

  /* 4. CÓMPUTO */
  {
    key: "computo",
    label: "Cómputo",
    href: "/categorias/computo",
    groups: [
      { title: "Laptops y accesorios", items: [{ label: "Ver todo", href: "/categorias/computo/laptops-y-accesorios" }] },
      { title: "Impresoras y escáneres", items: [{ label: "Ver todo", href: "/categorias/computo/impresoras-y-escaners" }] },
      { title: "Tablets", items: [{ label: "Ver todo", href: "/categorias/computo/tablets" }] },
    ],
  },

  /* 5. SMART HOME */
  {
    key: "smart-home",
    label: "Smart Home",
    href: "/categorias/smart-home",
    groups: [
      { title: "Convertidores smart", items: [{ label: "Ver todo", href: "/categorias/smart-home/convertidores-smart" }] },
      { title: "Parlantes inteligentes", items: [{ label: "Ver todo", href: "/categorias/smart-home/parlantes-inteligentes" }] },
      { title: "Aspiradores, robots y accesorios", items: [{ label: "Ver todo", href: "/categorias/smart-home/aspiradores-robots-y-accesorios" }] },
    ],
  },

  /* 6. TV Y VIDEO */
  {
    key: "tv-video",
    label: "TV y Video",
    href: "/categorias/tv-video",
    groups: [
      { title: "Televisores", items: [{ label: "Ver todo Televisores", href: "/categorias/tv-video/televisores" }] },
    ],
  },

  /* 7. ELECTROHOGAR */
  {
    key: "electrohogar",
    label: "Electrohogar",
    href: "/categorias/electrohogar",
    groups: [
      { title: "Refrigeración", items: [{ label: "Ver todo", href: "/categorias/electrohogar/refrigeracion" }] },
      { title: "Cocinas", items: [{ label: "Ver todo", href: "/categorias/electrohogar/cocinas" }] },
      { title: "Lavado", items: [{ label: "Ver todo", href: "/categorias/electrohogar/lavado" }] },
      { title: "Seguridad", items: [{ label: "Ver todo", href: "/categorias/electrohogar/seguridad" }] },
      { title: "Electrodomésticos", items: [{ label: "Ver todo", href: "/categorias/electrohogar/electrodomesticos" }] },
    ],
  },

  /* 8. DEPORTES Y AIRE LIBRE */
  {
    key: "deportes",
    label: "Deportes y Aire Libre",
    href: "/categorias/deportes",
    groups: [
      { title: "Scooters eléctricos", items: [{ label: "Ver todo", href: "/categorias/deportes/scooters-electricos" }] },
      { title: "Bicicletas", items: [{ label: "Ver todo", href: "/categorias/deportes/bicicletas" }] },
      { title: "Motos eléctricas", items: [{ label: "Ver todo", href: "/categorias/deportes/motos-electricas" }] },
    ],
  },

  /* 9. DRONES */
  {
    key: "drones",
    label: "Drones",
    href: "/categorias/drones",
    groups: [{ title: "Drones", items: [{ label: "Ver todo Drones", href: "/categorias/drones/drones" }] }],
  },

  /* 10. FOTOGRAFÍA */
  {
    key: "fotografia",
    label: "Fotografía",
    href: "/categorias/fotografia",
    groups: [
      { title: "Cámaras", items: [{ label: "Ver todo Cámaras", href: "/categorias/fotografia/camaras" }] },
      { title: "Soporte", items: [{ label: "Ver todo Soporte", href: "/categorias/fotografia/soporte" }] },
    ],
  },

  /* 11. MASCOTAS */
  {
    key: "mascotas",
    label: "Mascotas",
    href: "/categorias/mascotas",
    groups: [
      { title: "Rascadores", items: [{ label: "Ver todo", href: "/categorias/mascotas/rascadores" }] },
      { title: "Dispensadores electrónicos de comida", items: [{ label: "Ver todo", href: "/categorias/mascotas/dispensadores-electronicos-de-comida" }] },
      { title: "Comida", items: [{ label: "Ver todo", href: "/categorias/mascotas/comida" }] },
    ],
  },

  /* 12. JUGUETERÍA */
  {
    key: "jugueteria",
    label: "Juguetería",
    href: "/categorias/jugueteria",
    groups: [
      { title: "Educativos", items: [{ label: "Ver todo", href: "/categorias/jugueteria/educativos" }] },
      { title: "Otros juguetes", items: [{ label: "Ver todo", href: "/categorias/jugueteria/otros-juguetes" }] },
    ],
  },

  /* 13. MUNDO BEBÉ */
  {
    key: "bebe",
    label: "Mundo Bebé",
    href: "/categorias/bebe",
    groups: [
      { title: "Coches para bebés", items: [{ label: "Ver todo", href: "/categorias/bebe/coches-para-bebes" }] },
      { title: "Sillas para comer", items: [{ label: "Ver todo", href: "/categorias/bebe/sillas-para-comer" }] },
      { title: "Corrales para bebés", items: [{ label: "Ver todo", href: "/categorias/bebe/corrales-para-bebes" }] },
      { title: "Toboganes", items: [{ label: "Ver todo", href: "/categorias/bebe/toboganes" }] },
    ],
  },

  /* 14. VIAJES */
  {
    key: "viajes",
    label: "Viajes",
    href: "/categorias/viajes",
    groups: [
      { title: "Equipaje", items: [{ label: "Ver todo", href: "/categorias/viajes/equipaje" }] },
      { title: "Mochilas", items: [{ label: "Ver todo", href: "/categorias/viajes/mochilas" }] },
    ],
  },

  /* 15. NAVIDAD */
  {
    key: "navidad",
    label: "Navidad",
    href: "/categorias/navidad",
    groups: [
      { title: "Árboles", items: [{ label: "Ver todo", href: "/categorias/navidad/arboles" }] },
      { title: "Pijamas adultos", items: [{ label: "Ver todo", href: "/categorias/navidad/pijamas-adultos" }] },
      { title: "Pijamas niños/niñas", items: [{ label: "Ver todo", href: "/categorias/navidad/pijamas-ninos" }] },
      { title: "Polos adultos", items: [{ label: "Ver todo", href: "/categorias/navidad/polos-adultos" }] },
      { title: "Polos niños", items: [{ label: "Ver todo", href: "/categorias/navidad/polos-ninos" }] },
      { title: "Disfraces", items: [{ label: "Ver todo", href: "/categorias/navidad/disfraces" }] },
      { title: "Adornos navideños", items: [{ label: "Ver todo", href: "/categorias/navidad/adornos-navidenos" }] },
    ],
  },

  /* 16. CROCS */
  {
    key: "crocs",
    label: "Crocs",
    href: "/categorias/crocs",
    groups: [
      { title: "Niños", items: [{ label: "Ver todo Niños", href: "/categorias/crocs/ninos" }] },
      { title: "Adultos", items: [{ label: "Ver todo Adultos", href: "/categorias/crocs/adultos" }] },
    ],
  },
];
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

  // Cierra mega al hacer scroll
  useEffect(() => {
    const onScroll = () => setOpenMega(false);
    if (openMega) window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openMega]);

  // Bloquear scroll del fondo cuando el drawer está abierto
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (mobileDrawer) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";          // evita “drag” del fondo en iOS
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [mobileDrawer]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      {/* Top bar */}
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

      {/* Main bar */}
      <div className="px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/tecnohouse.svg"
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

          {/* Categorías (desktop) */}
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
              <ChevronDown size={16} className={cx("transition", openMega && "rotate-180")} />
            </button>
          </div>

          {/* Search (desktop) */}
          <form action="/buscar" className="flex-1 max-w-3xl mx-auto hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                name="q"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 h-10 rounded-md border bg-background text-sm outline-none focus:ring-2 ring-primary/20"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Botón para abrir Drawer móvil */}
            <button
              onClick={() => setMobileDrawer(true)}
              className="md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Menu size={18} />
              Categorías
            </button>

            <Link
              href="/tiendas"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Store size={18} />
              <span className="hidden lg:inline">Tiendas</span>
            </Link>

            <Link
              href="/ayuda"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <HelpCircle size={18} />
              <span className="hidden lg:inline">Ayuda</span>
            </Link>

            <Link
              href="/carrito"
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
            {/* Lista izquierda */}
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
                      onClick={() => setOpenMega(false)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Contenido derecho */}
            <section className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-semibold">{activeCategory?.label}</h3>
                <Link href={activeCategory?.href ?? "#"} className="text-sm text-primary hover:underline" onClick={() => setOpenMega(false)}>
                  Ver todo
                </Link>
              </div>

              {activeCategory?.groups?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCategory.groups.map((group) => (
                    <div key={group.title}>
                      <p className="text-sm font-semibold mb-2 text-red-600">{group.title}</p>
                      <ul className="space-y-1">
                        {group.items.map((it) => (
                          <li key={it.href}>
                            <Link href={it.href} className="text-sm text-muted-foreground hover:text-foreground hover:underline" onClick={() => setOpenMega(false)}>
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Próximamente subcategorías…</div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Search móvil */}
      <div className="md:hidden border-t">
        <div className="px-4 py-2">
          <form action="/buscar">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
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

      {/* === DRAWER MÓVIL (sin scroll del fondo, alto completo, scroll interno) === */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          {/* Overlay: bloquea interacción y scroll del fondo */}
          <button
            className="absolute inset-0 bg-black/40 touch-none"
            onClick={() => setMobileDrawer(false)}
            aria-label="Cerrar categorías"
          />

          {/* Panel lateral */}
          <div
            className={cx(
              "absolute left-0 top-0 w-[92%] max-w-[420px] bg-white shadow-xl",
              "grid grid-rows-[auto,1fr] h-[100dvh] overscroll-contain"
            )}
          >
            {/* Header del drawer */}
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

            {/* Contenido que scrollea (solo aquí) */}
            <div className="min-h-0 overflow-y-auto p-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              <ul className="space-y-2">
                {MEGA_DATA.map((cat, i) => (
                  <li key={cat.key} className="border rounded-md">
                    <details className="group [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                      <summary className="cursor-pointer list-none select-none px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{cat.label}</span>
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="px-3 pb-3">
                        {cat.groups?.length ? (
                          <ul className="space-y-3">
                            {cat.groups.map((group) => (
                              <li key={group.title}>
                                <p className="text-xs font-semibold text-red-600 mb-1">{group.title}</p>
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
                          <div className="text-xs text-muted-foreground">Próximamente subcategorías…</div>
                        )}

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
