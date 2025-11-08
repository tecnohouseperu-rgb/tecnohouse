// app/components/mega-data.ts
export type MegaItem = { label: string; href: string };
export type MegaGroup = { title: string; items: MegaItem[] };
export type MegaCategory = {
  key: string;
  label: string;
  href: string;
  groups: MegaGroup[];
};

export const MEGA_DATA: MegaCategory[] = [
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

  // Otras categorías (puedes ir llenándolas cuando quieras)
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
      { title: "Adultos", items: [{ label: "Ver adultos", href: "/categorias/crocs/adultos" }] },
      { title: "Niños", items: [{ label: "Ver niños", href: "/categorias/crocs/ninos" }] },
    ],
  },
];

export const CATEGORY_INDEX = MEGA_DATA.reduce<Record<string, MegaCategory>>((acc, c) => {
  acc[c.key] = c;
  return acc;
}, {});
