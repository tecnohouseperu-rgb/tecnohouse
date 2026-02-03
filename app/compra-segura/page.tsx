// app/compra-segura/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Compra Segura | TecnoHouse Perú",
  description:
    "Compra 100% segura en TecnoHouse Perú: pagos protegidos, garantía real, cambios y devoluciones claras, y soporte por WhatsApp.",
  alternates: { canonical: "/compra-segura" },
  openGraph: {
    title: "Compra Segura | TecnoHouse Perú",
    description:
      "Pagos protegidos, SSL, Mercado Pago, garantía y políticas claras para que compres con confianza.",
    url: "/compra-segura",
    siteName: "TecnoHouse Perú",
    type: "website",
  },
};

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-base font-semibold">{title}</p>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export default function CompraSeguraPage() {
  return (
    <>
      {/* HERO */}
      <header className="border-b bg-gradient-to-b from-white to-gray-50">
        <Container className="py-8 md:py-12">
          <nav className="text-xs md:text-sm text-muted-foreground mb-3">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Compra segura</li>
            </ol>
          </nav>

          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Compra segura y con confianza
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Protegemos tus datos y tu dinero. Usamos conexión cifrada (SSL),
                medios de pago confiables y políticas claras de cambios y
                devoluciones. Además, tienes soporte real por WhatsApp.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-xs font-medium shadow-sm">
                  🔒 SSL activo en todo el sitio
                </span>
                <span className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-xs font-medium shadow-sm">
                  🛡️ Protección de pagos
                </span>
                <span className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-xs font-medium shadow-sm">
                  💬 Soporte por WhatsApp
                </span>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  href="/ayuda"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Centro de ayuda
                </Link>
                <Link
                  href="https://wa.me/51908631949"
                  target="_blank"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Escríbenos por WhatsApp
                </Link>
              </div>
            </div>

            {/* Sello / confianza */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border bg-white shadow-md md:h-60 flex items-center justify-center p-4">
              <Image
                src="/ganador-ecommerces.png"
                alt="Reconocimiento eCommerce Award"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </Container>
      </header>

      {/* CONTENIDO */}
      <main>
        <Container className="py-10 lg:py-14">
          {/* Grid de confianza */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Pagos protegidos">
              <ul className="list-disc pl-5 space-y-1">
                <li>Tarjetas de débito y crédito a través de procesadores seguros.</li>
                <li>Transferencias y pagos móviles (incluye Mercado Pago).</li>
                <li>Confirmación y comprobante de pago para cada orden.</li>
              </ul>
            </Card>

            <Card title="Tus datos están seguros">
              <ul className="list-disc pl-5 space-y-1">
                <li>Conexión cifrada (HTTPS/SSL) en todo el proceso.</li>
                <li>No almacenamos datos sensibles de tarjetas.</li>
                <li>Uso limitado de la información para completar tu pedido.</li>
              </ul>
            </Card>

            <Card title="Cambios y devoluciones">
              <ul className="list-disc pl-5 space-y-1">
                <li>Productos con garantía por defecto de fábrica.</li>
                <li>Cambios por falla dentro del periodo de garantía.</li>
                <li>Empaque y accesorios completos para gestionar el caso.</li>
              </ul>
            </Card>

            <Card title="Despachos y cobertura">
              <ul className="list-disc pl-5 space-y-1">
                <li>Entregas en Lima 24–48h hábiles en zonas principales.</li>
                <li>Envíos a todo el Perú con operadores logísticos.</li>
                <li>Seguimiento y comunicación del estado del pedido.</li>
              </ul>
            </Card>

            <Card title="Atención y soporte">
              <ul className="list-disc pl-5 space-y-1">
                <li>WhatsApp: respuesta típica 5–15 min.</li>
                <li>Correo: dentro de 24 h hábiles.</li>
                <li>
                  Facebook:&nbsp;
                  <Link
                    href="https://www.facebook.com/profile.php?id=61583297501092"
                    target="_blank"
                    className="underline"
                  >
                    /TecnoHouse Perú
                  </Link>
                </li>
              </ul>
            </Card>

            <Card title="Tienda física (horario)">
              <ul className="list-disc pl-5 space-y-1">
                <li>Lunes a sábado: 09:00 – 18:00</li>
                <li>Dirección: Vulcano 127, ATE (cerca a Todo Remate)</li>
                <li>Recojo en tienda disponible.</li>
              </ul>
            </Card>
          </div>

          {/* Pasos de compra */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              ¿Cómo comprar?
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["1. Agrega al carrito", "Elige el producto y revisa características y garantía."],
                ["2. Completa tus datos", "Nombre, dirección y contacto para coordinar el envío."],
                ["3. Realiza el pago", "Tarjeta, transferencia o Mercado Pago, como prefieras."],
                ["4. Recibe tu pedido", "Envío a domicilio o recojo en tienda con comprobante."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tips de seguridad */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Recomendaciones de compra segura
            </h2>
            <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Verifica el candado 🔒 en la barra del navegador (HTTPS).</li>
              <li>No compartas códigos de verificación o claves por chat.</li>
              <li>Guarda tu comprobante y número de pedido para seguimiento.</li>
            </ul>
          </section>

          {/* CTA */}
          <div className="mt-10 rounded-3xl border bg-gradient-to-br from-white to-gray-50 p-7 text-center shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold">¿Tienes dudas?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Escríbenos y te ayudamos a completar tu compra con total confianza.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="https://wa.me/51908631949"
                target="_blank"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                WhatsApp
              </Link>
              <Link
                href="/ayuda"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Centro de ayuda
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
