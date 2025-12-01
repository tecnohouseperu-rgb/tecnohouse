"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  main_image_url: string | null;
  quantity: number;
  color?: string | null;
};

type AddItemInput = {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  main_image_url: string | null;
  quantity?: number;
  color?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: number, color?: string | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tecnohouse_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  // Cargar del localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.warn("Error leyendo carrito:", e);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error guardando carrito:", e);
    }
  }, [items]);

  const addItem = (input: AddItemInput) => {
    const quantity = input.quantity && input.quantity > 0 ? input.quantity : 1;
    const baseItem: CartItem = {
      id: input.id,
      name: input.name,
      slug: input.slug,
      price: input.price,
      main_image_url: input.main_image_url,
      quantity,
      color: input.color ?? null,
    };

    setItems((prev) => {
      const index = prev.findIndex(
        (i) => i.id === baseItem.id && i.color === baseItem.color
      );
      if (index >= 0) {
        const clone = [...prev];
        clone[index] = {
          ...clone[index],
          quantity: clone[index].quantity + quantity,
        };
        return clone;
      }
      return [...prev, baseItem];
    });

    setLastAdded(baseItem);
  };

  const removeItem = (id: number, color?: string | null) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && (color ?? null) === (i.color ?? null)))
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
      <AddToCartToast item={lastAdded} onClose={() => setLastAdded(null)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}

// Toast flotante cuando se agrega al carrito
function AddToCartToast({
  item,
  onClose,
}: {
  item: CartItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [item, onClose]);

  if (!item) return null;

  const imgSrc =
    item.main_image_url ??
    "https://via.placeholder.com/80x80.png?text=Producto";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-neutral-900/90 px-4 py-3 text-sm text-white shadow-xl backdrop-blur">
        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white">
          <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Añadido al carrito</p>
          <p className="line-clamp-1 text-xs text-neutral-200">{item.name}</p>
          {item.color && (
            <p className="text-[11px] text-neutral-300">Color: {item.color}</p>
          )}
        </div>
        <Link
          href="/carrito"
          className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium transition hover:bg-white hover:text-neutral-900"
        >
          Ver carrito
        </Link>
        <button
          onClick={onClose}
          className="ml-1 text-xs text-neutral-300 hover:text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
