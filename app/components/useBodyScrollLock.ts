// app/components/useBodyScrollLock.ts
import { useEffect, useRef } from "react";

/**
 * Bloquea el scroll del body sin congelar la app.
 * Guarda la posición actual y al cerrar vuelve exactamente al mismo lugar.
 */
export default function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const body = document.body;

    if (locked) {
      scrollYRef.current = window.scrollY || window.pageYOffset;
      // “Fijamos” el body para que no se mueva
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";           // evita “drag” del fondo en iOS
      body.style.overscrollBehaviorY = "contain";
    } else {
      // Restauramos estilos y posición exacta
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      body.style.overscrollBehaviorY = "";
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      // cleanup por si desmonta con el lock activo
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      body.style.overscrollBehaviorY = "";
    };
  }, [locked]);
}
