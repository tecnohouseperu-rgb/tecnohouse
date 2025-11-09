// app/components/TopBanner.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type BannerItem = { id: string; content?: ReactNode; text?: string };

type Props = {
  items: BannerItem[];
  bgClass?: string;
  textClass?: string;
  className?: string;
  animated?: boolean; // default true
  emoji?: string;      // ej. “🚚”
};

export default function TopBanner({
  items,
  bgClass = "bg-gray-900",
  textClass = "text-white",
  className = "",
  animated = true,
  emoji = "🚚",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState(0);
  const reduce = useReducedMotion();
  const curr = items[0] ?? { id: "0", content: null, text: "" };

  const measure = () => {
    const height = ref.current?.offsetHeight ?? 0;
    setH(height);
    // altura disponible para que el header se posicione debajo
    document.documentElement.style.setProperty("--tb-h", `${height}px`);
  };

  useLayoutEffect(measure, []);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* Barra fija arriba */}
      <div
        ref={ref}
        className={[
          "fixed top-0 left-0 right-0 z-[1000]",
          bgClass,
          textClass,
          // leve sombra y borde como los e-commerce grandes
          "shadow-[0_2px_10px_-6px_rgba(0,0,0,0.35)] border-b border-white/10",
          "pt-[env(safe-area-inset-top)]", // iOS notch
          className,
        ].join(" ")}
        role="region"
        aria-label="Aviso"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center gap-2 py-2">
            <motion.span
              aria-hidden
              className="text-lg md:text-xl"
              animate={animated && !reduce ? { x: [0, 4, -4, 0] } : undefined}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              {emoji}
            </motion.span>

            <div className="text-[13px] md:text-[15px] leading-tight text-center font-medium">
              {curr.content ?? (
                <span dangerouslySetInnerHTML={{ __html: curr.text ?? "" }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer para que el contenido no quede tapado */}
      <div style={{ height: h }} aria-hidden />
    </>
  );
}
