export interface SubCategory {
  name: string;
  items: string[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "audio",
    name: "Audio",
    subcategories: [
      {
        name: "Audífonos",
        items: [
          "Bluetooth on ear",
          "Bluetooth in ear",
          "True Wireless",
          "Con cable",
          "Audífonos gamer",
          "Cancelación de ruido",
          "Manos libres"
        ]
      },
      {
        name: "Parlantes",
        items: [
          "Bluetooth",
          "Portátiles",
          "Para auto",
          "Smart",
          "Torre",
          "Karaoke"
        ]
      },
      {
        name: "Micrófonos",
        items: [
          "Convencionales",
          "Inalámbricos",
          "Podcast",
          "De estudio"
        ]
      },
      {
        name: "Radios y Grabadoras",
        items: ["Radios", "Grabadoras de voz"]
      }
    ]
  },

  // AGREGAMOS TODAS LAS QUE PASASTE
  {
    id: "celulares",
    name: "Celulares y Accesorios",
    subcategories: [
      { name: "Celulares", items: ["Gama alta", "Gama media", "Gama baja"] },
      { name: "Relojes inteligentes", items: ["Smartwatch", "Band"] },
      { name: "Cargadores", items: ["Cargadores", "Cables", "Bases"] },
      { name: "Baterías externas", items: ["Powerbanks"] }
    ]
  },

  {
    id: "gamer",
    name: "Gamer",
    subcategories: [
      { name: "Consolas", items: ["PS5", "Xbox", "Nintendo Switch"] },
      { name: "Juegos", items: ["PS5", "Xbox", "Switch"] },
      { name: "Laptops gamer", items: [] },
      { name: "Mandos gamer", items: [] },
      { name: "Sillas y mesas", items: [] }
    ]
  },

  {
    id: "computo",
    name: "Cómputo",
    subcategories: [
      { name: "Laptops y accesorios", items: [] },
      { name: "Impresoras y escáneres", items: [] },
      { name: "Tablets", items: [] }
    ]
  },

  {
    id: "smart-home",
    name: "Smart Home",
    subcategories: [
      { name: "Convertidores Smart", items: [] },
      { name: "Parlantes inteligentes", items: [] },
      { name: "Aspiradoras/robots", items: [] }
    ]
  },

  {
    id: "tv-video",
    name: "TV y Video",
    subcategories: [{ name: "Televisores", items: [] }]
  },

  {
    id: "electrohogar",
    name: "Electrohogar",
    subcategories: [
      { name: "Refrigeración", items: [] },
      { name: "Cocinas", items: [] },
      { name: "Lavado", items: [] },
      { name: "Seguridad", items: [] },
      { name: "Electrodomésticos", items: [] }
    ]
  },

  // ... Puedes seguir agregando igual para el resto
];
