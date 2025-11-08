"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../data/categories";

export default function CategoriesMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState("audio");

  if (!open) return null;

  const activeCategory = CATEGORIES.find((c) => c.id === active);

  return (
    <>
      {/* Fondo oscurecido */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel principal */}
      <div className="fixed top-0 left-0 w-full md:w-[85%] lg:w-[70%] h-full bg-white z-50 flex flex-col shadow-xl animate-slide-right">

        {/* Header del modal */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-xl font-semibold">Categorías</h2>
          <button onClick={onClose}>
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Panel izquierdo */}
          <div className="w-[35%] md:w-[25%] bg-gray-50 border-r overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`w-full text-left px-4 py-3 border-b text-sm font-medium hover:bg-white transition
                ${active === cat.id ? "bg-white text-red-600 font-semibold" : "text-gray-700"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Panel derecho */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">{activeCategory?.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {activeCategory?.subcategories.map((sub) => (
                <div key={sub.name}>
                  <h4 className="font-semibold text-red-600 mb-2">{sub.name}</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {sub.items.map((item) => (
                      <li key={item} className="hover:underline cursor-pointer">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>

      {/* Animación */}
      <style jsx>{`
        .animate-slide-right {
          animation: slideRight 0.2s ease-out;
        }
        @keyframes slideRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
