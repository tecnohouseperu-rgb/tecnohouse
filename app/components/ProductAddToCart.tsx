"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-provider";

type Props = {
  id: number;
  name: string;
  price: number | null;
  mainImage: string | null;
};

export function ProductAddToCart({ id, name, price, mainImage }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const minus = () => setQty((q) => (q > 1 ? q - 1 : 1));
  const plus = () => setQty((q) => (q < 99 ? q + 1 : 99));

  const handleAdd = () => {
    addItem({ id, name, price, mainImage }, qty);
  };

  const handleBuyNow = () => {
    addItem({ id, name, price, mainImage }, qty);
    router.push("/carrito");
  };

  return (
    <div className="space-y-4">
      {/* Cantidad */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-700">Cantidad</span>
        <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-1">
          <button
            type="button"
            onClick={minus}
            className="h-8 w-8 rounded-full text-lg leading-none text-neutral-700 hover:bg-neutral-100"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">
            {qty}
          </span>
          <button
            type="button"
            onClick={plus}
            className="h-8 w-8 rounded-full text-lg leading-none text-neutral-700 hover:bg-neutral-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleAdd}
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
