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
  color?: string | null; // 👈 NUEVO
};

type CartContextType = {
  items: CartItem[];
  addItem: (
    item: {
      id: number;
      name: string;
      price: number | null;
      mainImage: string | null;
      color?: string | null;
    },
    qty?: number
  ) => void;
  removeItem: (id: number) => void;
  clear: () => void;

  // actualizar cantidad absoluta
  updateQty: (id: number, qty: number) => void;

  // contador total de unidades
  count: number;

  // Toast
  lastAdded: CartItem | null;
  toastVisible: boolean;
  hideToast: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// si quieres evitar conflictos con el formato viejo, puedes cambiar a v2
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
      // 👇 ahora diferenciamos por id + color
      const existing = prev.find(
        (p) => p.id === item.id && p.color === item.color
      );

      let newItems: CartItem[];

      if (existing) {
        newItems = prev.map((p) =>
          p.id === item.id && p.color === item.color
            ? { ...p, qty: p.qty + qty }
            : p
        );
      } else {
        newItems = [...prev, { ...item, qty }];
      }

      const added =
        newItems.find(
          (p) => p.id === item.id && p.color === item.color
        ) ?? { ...item, qty };

      setLastAdded(added);
      setToastVisible(true);
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    // ⚠️ sigue eliminando por id; si algún día tienes muchos colores del mismo id
    // y quieres borrar solo uno, luego refinamos esto para usar un identificador único
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  // cambiar cantidad directa, sin mostrar toast
  const updateQty: CartContextType["updateQty"] = (id, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, Math.floor(qty) || 1) } : p
      )
    );
  };

  const hideToast = () => setToastVisible(false);

  // contador total de unidades
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
