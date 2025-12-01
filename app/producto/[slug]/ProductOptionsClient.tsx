"use client";

import { useState } from "react";

type Props = {
  price: number | null;
  oldPrice: number | null;
  colors: string[];
};

export default function ProductOptionsClient({
  price,
  oldPrice,
  colors,
}: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);

  const maxQty = 10;

  const displayPrice =
    price !== null && price !== undefined ? `S/ ${price}` : "Consultar";

  function handleDecrease() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }

  function handleIncrease() {
    setQuantity((q) => (q < maxQty ? q + 1 : maxQty));
  }

  function handleAddToCart() {
    console.log("Añadir al carrito", {
      color: selectedColor,
      quantity,
    });
  }

  function handleBuyNow() {
    console.log("Comprar ahora", {
      color: selectedColor,
      quantity,
    });
  }

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm space-y-4">
      {/* Precio */}
      <div className="space-y-1">
        {oldPrice && (
          <p className="text-sm text-neutral-400 line-through">
            S/ {oldPrice}
          </p>
        )}
        <p className="text-3xl font-semibold text-red-600">{displayPrice}</p>
        <p className="text-xs text-neutral-500">
          Precio incluye IGV. Stock sujeto a confirmación.
        </p>
      </div>

      {/* Colores */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-neutral-800">
              Color
            </h3>
            {selectedColor && (
              <span className="text-xs text-neutral-500">
                Seleccionado: <span className="font-medium">{selectedColor}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>

          {!selectedColor && (
            <p className="text-[11px] text-red-500">
              Selecciona un color para continuar.
            </p>
          )}
        </div>
      )}

      {/* Cantidad */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-neutral-800">
          Cantidad
        </h3>
        <div className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-50 px-2 py-1">
          <button
            type="button"
            onClick={handleDecrease}
            className="h-7 w-7 rounded-full text-lg leading-none text-neutral-700 hover:bg-neutral-200"
          >
            −
          </button>
          <span className="mx-3 w-6 text-center text-sm font-semibold text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="h-7 w-7 rounded-full text-lg leading-none text-neutral-700 hover:bg-neutral-200"
          >
            +
          </button>
        </div>
        <p className="text-[11px] text-neutral-500">
          Máximo {maxQty} unidades por pedido.
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
        >
          Añadir al carrito
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full rounded-lg border border-neutral-800 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 active:scale-[0.98]"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
