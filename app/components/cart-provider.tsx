"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CartItem = {
  id: number;
  name: string;
  price: number | null;
  mainImage: string | null;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (
    item: { id: number; name: string; price: number | null; mainImage: string | null },
    qty?: number
  ) => void;
  removeItem: (id: number) => void;
  clear: () => void;

  // 👉 nuevo: actualizar cantidad absoluta
  updateQty: (id: number, qty: number) => void;

  // contador total de unidades
  count: number;

  // Toast
  lastAdded: CartItem | null;
  toastVisible: boolean;
  hideToast: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "tecnohouse-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Cargar del localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(parsed);
      }
    } catch {
      // ignorar errores de parseo
    }
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      let newItems: CartItem[];

      if (existing) {
        newItems = prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      } else {
        newItems = [...prev, { ...item, qty }];
      }

      const added =
        newItems.find((p) => p.id === item.id) ?? {
          ...item,
          qty,
        };

      setLastAdded(added);
      setToastVisible(true);
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  // 👇 nuevo: cambiar cantidad directa, sin mostrar toast
  const updateQty: CartContextType["updateQty"] = (id, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, Math.floor(qty) || 1) } : p
      )
    );
  };

  const hideToast = () => setToastVisible(false);

  // 🔢 contador total de unidades
  const count = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clear,
        updateQty,
        count,
        lastAdded,
        toastVisible,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
