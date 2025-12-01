// app/components/Header.tsx
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
import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { useCart } from "./cart-provider";
import { usePathname, useRouter } from "next/navigation";

const CartFab = dynamic(() => import("@/app/components/CartFab"), {
  ssr: false,
});

function cx(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

type MegaItem = { label: string; href: string };
type MegaGroup = { title: string; items: MegaItem[] };
type MegaCategory = {
  key: string;
  label: string;
  href: string;
  groups: MegaGroup[];
};

/* ====== DATA DE CATEGORÍAS ====== */
const MEGA_DATA: MegaCategory[] = [
  {
    key: "audio",
    label: "Audio",
    href: "/categorias/audio",
    groups: [
      {
        title: "Audífonos",
        items: [
          { label: "Audífonos", href: "/categorias/audio/audifonos" },
        ],
      },
      {
        title: "Parlantes",
        items: [
          { label: "Parlantes", href: "/categorias/audio/parlantes" },
        ],
      },
      {
        title: "Micrófonos",
        items: [
          { label: "Micrófonos", href: "/categorias/audio/microfonos" },
        ],
      },
    ],
  },
  {
    key: "celulares",
    label: "Celulares y Accesorios",
    href: "/categorias/celulares",
    groups: [
      {
        title: "Celulares",
        items: [
          { label: "Celulares", href: "/categorias/celulares/celulares" },
        ],
      },
      {
        title: "Relojes inteligentes",
        items: [
          {
            label: "Relojes inteligentes",
            href: "/categorias/celulares/relojes-inteligentes",
          },
        ],
      },
      {
        title: "Accesorios",
        items: [
          { label: "Cargadores", href: "/categorias/celulares/cargadores" },
          {
            label: "Baterías externas",
            href: "/categorias/celulares/baterias-externas",
          },
          { label: "Cables", href: "/categorias/celulares/cables" },
        ],
      },
    ],
  },
  {
    key: "gamer",
    label: "Gamer",
    href: "/categorias/gamer",
    groups: [
      {
        title: "Consolas",
        items: [{ label: "Consolas", href: "/categorias/gamer/consolas" }],
      },
      { title: "Juegos", items: [{ label: "Juegos", href: "/categorias/gamer/juegos" }] },
      {
        title: "Laptops gamers",
        items: [
          {
            label: "Laptops gamers",
            href: "/categorias/gamer/laptops-gamers",
          },
        ],
      },
      {
        title: "Mandos gamers",
        items: [
          {
            label: "Mandos gamers",
            href: "/categorias/gamer/mandos-gamers",
          },
        ],
      },
      {
        title: "Sillas y mesas",
        items: [
          { label: "Sillas y mesas", href: "/categorias/gamer/sillas-mesas" },
        ],
      },
    ],
  },
  {
    key: "computo",
    label: "Cómputo",
    href: "/categorias/computo",
    groups: [
      {
        title: "Laptops y accesorios",
        items: [
          {
            label: "Laptops y accesorios",
            href: "/categorias/computo/laptops-accesorios",
          },
        ],
      },
      {
        title: "Impresoras y escáneres",
        items: [
          {
            label: "Impresoras y escáneres",
            href: "/categorias/computo/impresoras-escaners",
          },
        ],
      },
      { title: "Tablets", items: [{ label: "Tablets", href: "/categorias/computo/tablets" }] },
    ],
  },
  {
    key: "smart-home",
    label: "Smart Home",
    href: "/categorias/smart-home",
    groups: [
      {
        title: "Convertidores smart",
        items: [
          {
            label: "Convertidores smart",
            href: "/categorias/smart-home/convertidores-smart",
          },
        ],
      },
      {
        title: "Parlantes inteligentes",
        items: [
          {
            label: "Parlantes inteligentes",
            href: "/categorias/smart-home/parlantes-inteligentes",
          },
        ],
      },
      {
        title: "Aspiradores, robots y accesorios",
        items: [
          {
            label: "Aspiradores, robots y accesorios",
            href: "/categorias/smart-home/aspiradores-robots-accesorios",
          },
        ],
      },
    ],
  },
  {
    key: "tv-video",
    label: "TV y Video",
    href: "/categorias/tv-video",
    groups: [
      {
        title: "Televisores",
        items: [
          { label: "Televisores", href: "/categorias/tv-video/televisores" },
        ],
      },
    ],
  },
  {
    key: "electrohogar",
    label: "Electrohogar",
    href: "/categorias/electrohogar",
    groups: [
      {
        title: "Refrigeración",
        items: [
          {
            label: "Refrigeración",
            href: "/categorias/electrohogar/refrigeracion",
          },
        ],
      },
      { title: "Cocinas", items: [{ label: "Cocinas", href: "/categorias/electrohogar/cocinas" }] },
      { title: "Lavado", items: [{ label: "Lavado", href: "/categorias/electrohogar/lavado" }] },
      {
        title: "Seguridad",
        items: [
          { label: "Seguridad", href: "/categorias/electrohogar/seguridad" },
        ],
      },
      {
        title: "Electrodomésticos",
        items: [
          {
            label: "Electrodomésticos",
            href: "/categorias/electrohogar/electrodomesticos",
          },
        ],
      },
    ],
  },
  {
    key: "deportes",
    label: "Deportes y Aire Libre",
    href: "/categorias/deportes",
    groups: [
      {
        title: "Movilidad",
        items: [
          {
            label: "Scooters eléctricos",
            href: "/categorias/deportes/scooters-electricos",
          },
          { label: "Bicicletas", href: "/categorias/deportes/bicicletas" },
          {
            label: "Motos eléctricas",
            href: "/categorias/deportes/motos-electricas",
          },
        ],
      },
    ],
  },
  {
    key: "drones",
    label: "Drones",
    href: "/categorias/drones",
    groups: [
      { title: "Drones", items: [{ label: "Drones", href: "/categorias/drones/drones" }] },
    ],
  },
  {
    key: "fotografia",
    label: "Fotografía",
    href: "/categorias/fotografia",
    groups: [
      {
        title: "Cámaras",
        items: [{ label: "Cámaras", href: "/categorias/fotografia/camaras" }],
      },
      {
        title: "Soporte",
        items: [{ label: "Soporte", href: "/categorias/fotografia/soporte" }],
      },
    ],
  },
  {
    key: "mascotas",
    label: "Mascotas",
    href: "/categorias/mascotas",
    groups: [
      {
        title: "Rascadores",
        items: [{ label: "Rascadores", href: "/categorias/mascotas/rascadores" }],
      },
      {
        title: "Dispensadores electrónicos de comida",
        items: [
          {
            label: "Dispensadores electrónicos de comida",
            href: "/categorias/mascotas/dispensadores-comida",
          },
        ],
      },
      { title: "Comida", items: [{ label: "Comida", href: "/categorias/mascotas/comida" }] },
    ],
  },
  {
    key: "jugueteria",
    label: "Juguetería",
    href: "/categorias/jugueteria",
    groups: [
      {
        title: "Educativos",
        items: [{ label: "Educativos", href: "/categorias/jugueteria/educativos" }],
      },
      {
        title: "Otros juguetes",
        items: [{ label: "Otros juguetes", href: "/categorias/jugueteria/otros" }],
      },
    ],
  },
  {
    key: "bebe",
    label: "Mundo Bebé",
    href: "/categorias/bebe",
    groups: [
      {
        title: "Coches para bebés",
        items: [{ label: "Coches para bebés", href: "/categorias/bebe/coches" }],
      },
      {
        title: "Sillas para comer",
        items: [
          { label: "Sillas para comer", href: "/categorias/bebe/sillas-comer" },
        ],
      },
      {
        title: "Corrales para bebés",
        items: [
          { label: "Corrales para bebés", href: "/categorias/bebe/corrales" },
        ],
      },
      {
        title: "Toboganes",
        items: [{ label: "Toboganes", href: "/categorias/bebe/toboganes" }],
      },
    ],
  },
  {
    key: "viajes",
    label: "Viajes",
    href: "/categorias/viajes",
    groups: [
      {
        title: "Equipaje",
        items: [{ label: "Equipaje", href: "/categorias/viajes/equipaje" }],
      },
      {
        title: "Mochilas",
        items: [{ label: "Mochilas", href: "/categorias/viajes/mochilas" }],
      },
    ],
  },
  {
    key: "navidad",
    label: "Navidad",
    href: "/categorias/navidad",
    groups: [
      {
        title: "Temporada",
        items: [
          { label: "Árboles", href: "/categorias/navidad/arboles" },
          {
            label: "Pijamas adultos",
            href: "/categorias/navidad/pijamas-adultos",
          },
          {
            label: "Pijamas niños/niñas",
            href: "/categorias/navidad/pijamas-ninos",
          },
          {
            label: "Polos adultos",
            href: "/categorias/navidad/polos-adultos",
          },
          {
            label: "Polos niños",
            href: "/categorias/navidad/polos-ninos",
          },
          { label: "Disfraces", href: "/categorias/navidad/disfraces" },
          {
            label: "Adornos navideños",
            href: "/categorias/navidad/adornos",
          },
        ],
      },
    ],
  },
  {
    key: "crocs",
    label: "Crocs",
    href: "/categorias/crocs",
    groups: [
      { title: "Niños", items: [{ label: "Niños", href: "/categorias/crocs/ninos" }] },
      {
        title: "Adultos",
        items: [{ label: "Adultos", href: "/categorias/crocs/adultos" }],
      },
    ],
  },
];

const CATEGORY_INDEX = MEGA_DATA.reduce<Record<string, MegaCategory>>(
  (acc, c) => {
    acc[c.key] = c;
    return acc;
  },
  {}
);

export default function Header() {
  const [openMega, setOpenMega] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(MEGA_DATA[0].key);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const activeCategory = useMemo(
    () => CATEGORY_INDEX[activeKey],
    [activeKey]
  );

  // 👉 Datos del carrito para el botón de desktop
  const { items } = useCart();
  const itemCount = items.reduce((acc, it) => acc + it.qty, 0);
  const subtotal = items.reduce((acc, it) => acc + (it.price ?? 0) * it.qty, 0);
  const subtotalLabel = `S/ ${subtotal.toFixed(2)}`;

  // 👉 Ruta actual para decidir cuándo ocultar el FAB
  const pathname = usePathname();
  const hideCartFab = pathname?.startsWith("/checkout");
  // si quieres ocultarlo también en /carrito:
  // const hideCartFab = pathname?.startsWith("/checkout") || pathname === "/carrito";

  // 👉 Router para búsqueda
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  const handleSearchMobile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = mobileSearchTerm.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  // Cierre del mega por click afuera / ESC
  const megaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!openMega) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (megaRef.current && !megaRef.current.contains(target))
        setOpenMega(false);
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpenMega(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMega]);

  // Body lock al abrir drawer móvil
  const scrollYRef = useRef(0);
  useEffect(() => {
    const body = document.body;
    if (mobileDrawer) {
      scrollYRef.current =
        window.scrollY || window.pageYOffset || 0;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      const y = -parseInt(body.style.top || "0", 10) || 0;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (y) window.scrollTo(0, y);
    }
    return () => {
      const y = -parseInt(body.style.top || "0", 10) || 0;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (mobileDrawer && y) window.scrollTo(0, y);
    };
  }, [mobileDrawer]);

  return (
    <header className="sticky top-[var(--tb-h,0px)] z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      {/* Top bar */}
      <div className="hidden md:flex items-center justify-between text-xs text-muted-foreground px-4 lg:px-6 h-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>Envíos en todo el Perú</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/tiendas"
            className="hover:text-foreground flex items-center gap-1"
          >
            <Store size={14} /> Nuestras Tiendas
          </Link>
          <Link
            href="/canales-de-atencion"
            className="hover:text-foreground flex items-center gap-1"
          >
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
              aria-expanded={openMega}
              aria-controls="mega-menu"
            >
              <Menu size={18} />
              Categorías
              <ChevronDown
                size={16}
                className={cx("transition", openMega && "rotate-180")}
              />
            </button>
          </div>

          {/* Search (desktop) con botón submit en la lupa */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl mx-auto hidden md:flex"
          >
            <div className="relative w-full">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 h-10 rounded-md border bg-background text-sm outline-none focus:ring-2 ring-primary/20"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Acciones */}
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Drawer móvil */}
            <button
              onClick={() => setMobileDrawer(true)}
              className="md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Menu size={18} />
              Categorías
            </button>

            {/* Enlaces extra desktop */}
            <Link
              href="/tiendas"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <Store size={18} />
              <span className="hidden lg:inline">Tiendas</span>
            </Link>

            <Link
              href="/canales-de-atencion"
              className="hidden md:inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
            >
              <HelpCircle size={18} />
              <span className="hidden lg:inline">Ayuda</span>
            </Link>

            {/* ✅ Carrito desktop con cantidad y subtotal */}
            <Link
              href="/carrito"
              className={cx(
                "hidden md:inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm",
                "bg-black text-white hover:bg-neutral-900 transition"
              )}
            >
              <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] leading-[18px] text-white text-center bg-red-500">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold">Carrito</span>
                <span className="text-[11px] text-neutral-200">
                  {subtotalLabel}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mega menú desktop */}
      {openMega && (
        <div
          id="mega-menu"
          ref={megaRef}
          className="hidden md:block border-t bg-white"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-[240px_1fr] min-h-[420px]">
            <aside className="border-r p-2">
              <ul className="space-y-1">
                {MEGA_DATA.map((cat) => (
                  <li key={cat.key}>
                    <button
                      className={cx(
                        "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted/70 transition",
                        activeKey === cat.key &&
                          "bg-muted/70 font-medium"
                      )}
                      onMouseEnter={() => setActiveKey(cat.key)}
                      onFocus={() => setActiveKey(cat.key)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="p-4">
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

      {/* Search móvil con botón submit en la lupa */}
      <div className="md:hidden border-t">
        <div className="px-4 py-2">
          <form onSubmit={handleSearchMobile}>
            <div className="relative">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
              <input
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 h-10 rounded-md border bg-background text-sm outline-none focus:ring-2 ring-primary/20"
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Drawer móvil */}
      {mobileDrawer && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileDrawer(false)}
            aria-label="Cerrar categorías"
          />

          {/* Panel */}
          <div
            className={cx(
              "absolute left-0 top-0 w-[92%] max-w-[420px] bg-white shadow-xl",
              "h-[100dvh] grid grid-rows-[auto,1fr]"
            )}
          >
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

            <div className="min-h-0 overflow-y-auto p-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              <ul className="space-y-2">
                {MEGA_DATA.map((cat, i) => (
                  <li key={cat.key} className="border rounded-md">
                    <details
                      className="group [&_summary::-webkit-details-marker]:hidden"
                      open={i === 0}
                    >
                      <summary className="cursor-pointer list-none select-none px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {cat.label}
                        </span>
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="px-3 pb-3">
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
                                        onClick={() =>
                                          setMobileDrawer(false)
                                        }
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

      {/* ✅ FAB de carrito para móvil (abajo a la derecha, sin duplicados) */}
      {!hideCartFab && <CartFab z={900} threshold={200} />}
    </header>
  );
}
