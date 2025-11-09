// app/components/PromoFreeShipping.tsx
// Server Component (no "use client")
type Props = {
  threshold?: number; // soles
};

export default function PromoFreeShipping({ threshold = 200 }: Props) {
  // Banner sobrio, sin botón de cerrar, sin "Ayuda"
  return (
    <div className="w-full bg-[#0B1220] text-white">
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        <div className="h-10 md:h-11 flex items-center justify-center text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] md:text-xs font-medium tracking-wide">
              🚚 Envío gratis
            </span>
            <p className="text-white/90">
              En compras desde <strong>S/ {threshold}</strong> a <strong>Lima y todo el Perú</strong>.
            </p>
          </div>

          {/* En desktop, links a políticas a la derecha; ocultos en móvil */}
          <div className="ml-auto hidden md:flex items-center gap-5 text-white/70">
            <a href="/terminos-y-condiciones" className="hover:text-white underline underline-offset-2">
              Términos & Condiciones
            </a>
            <a href="/cambios-y-devoluciones" className="hover:text-white underline underline-offset-2">
              Cambios y devoluciones
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
