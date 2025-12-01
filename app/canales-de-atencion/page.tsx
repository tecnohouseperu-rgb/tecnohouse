// app/canales-de-atencion/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Canales de Atención | TecnoHouse Perú",
  description:
    "Contáctanos por WhatsApp, correo o visita nuestra tienda. Horarios actualizados y soporte post-venta real.",
  alternates: { canonical: "/canales-de-atencion" },
  openGraph: {
    title: "Canales de Atención | TecnoHouse Perú",
    description:
      "Soporte real por WhatsApp, correo y tienda física. Envíos y garantía a nivel nacional.",
    url: "/canales-de-atencion",
    siteName: "TecnoHouse Perú",
    type: "website",
  },
};

function Container({ children, className = "" }: any) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function ChannelCard({
  title,
  desc,
  href,
  icon,
  extra,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white/80 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center size-10 rounded-full border bg-white">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Link
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-muted/60"
        >
          Abrir
        </Link>
        {extra}
      </div>
    </div>
  );
}

export default function CanalesDeAtencionPage() {
  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Cuál es el tiempo de respuesta por WhatsApp?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En horario de tienda respondemos en 5–15 minutos.",
                },
              },
              {
                "@type": "Question",
                name: "¿Hacen envíos a provincia?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, enviamos a todo el Perú mediante operadores logísticos.",
                },
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <header className="relative overflow-hidden border-b bg-gradient-to-b from-white to-gray-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_400px_at_50%_-200px,rgba(59,130,246,0.10),transparent)]"
        />
        <Container className="py-10 md:py-14">
          <nav className="text-xs md:text-sm text-muted-foreground mb-3">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Canales de atención</li>
            </ol>
          </nav>

          <div className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Estamos aquí para ayudarte
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Escríbenos por WhatsApp, correo o visítanos en tienda. Nuestro
                equipo responde rápido y brinda post-venta real.
              </p>

              <div className="mt-6 flex gap-2">
                <Link
                  href="https://wa.me/51908577861"
                  target="_blank"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/60"
                >
                  WhatsApp inmediato
                </Link>
                <Link
                  href="/ayuda"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Centro de ayuda
                </Link>
              </div>
            </div>

            {/* Imagen institucional */}
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border bg-white shadow-md md:h-60 flex items-center justify-center p-4">
              <Image
                src="/ganador-ecommerces.png"
                alt="Premio eCommerce Award - TecnoHouse Perú"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* SLA */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                5–15 min
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Correo</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                24 h hábiles
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Tienda física</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                09:00–18:00
              </p>
            </div>
                      </div>
        </Container>
      </header>

      {/* CANALES */}
      <section className="py-10 lg:py-14">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            Canales de contacto
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* WhatsApp */}
            <ChannelCard
              title="WhatsApp"
              desc="Atención inmediata, estado de pedido y soporte post-venta."
              href="https://wa.me/51908577861"
              icon={<span className="text-lg">💬</span>}
              extra={<span className="text-xs text-muted-foreground">+51 908 577 861</span>}
            />

            {/* Correo */}
            <ChannelCard
              title="Correo"
              desc="Cotizaciones, comprobantes, soporte y documentos."
              href="mailto:ventas@tecnohouse.pe?subject=Consulta%20TecnoHouse"
              icon={<span className="text-lg">📧</span>}
              extra={<span className="text-xs text-muted-foreground">ventas@tecnohouse.pe</span>}
            />

            {/* Facebook */}
            <ChannelCard
              title="Facebook"
              desc="Atención por mensajes, novedades y ofertas."
              href="https://www.facebook.com/profile.php?id=61583297501092"
              icon={<span className="text-lg">📱</span>}
              extra={<span className="text-xs text-muted-foreground">Página oficial</span>}
            />

            {/* Tienda física */}
            <ChannelCard
              title="Tienda física"
              desc="Vulcano 127, ATE – Lima. A unas puertas de Todo Remate."
              href="https://maps.google.com/maps?q=Vulcano%20127%20ATE%20Lima&z=16"
              icon={<span className="text-lg">📍</span>}
              extra={<span className="text-xs text-muted-foreground">Ver mapa</span>}
            />
          </div>
        </Container>
      </section>

      {/* MAPA + HORARIO */}
      <section className="py-6 lg:py-10">
        <Container>
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Ubicación</p>
              <p className="font-medium">Vulcano 127, ATE – Lima</p>
              <p className="text-sm text-muted-foreground">
                (A unas puertas de Todo Remate)
              </p>

              <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg border">
                <iframe
                  title="Mapa TecnoHouse"
                  className="h-full w-full"
                  loading="lazy"
                  src="https://maps.google.com/maps?q=Vulcano%20127%20ATE%20Lima&z=16&output=embed"
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Horario tienda</p>
              <ul className="text-sm space-y-1">
                <li>Lunes a Sábado: 09:00 – 18:00</li>
                <li>Domingo: Cerrado</li>
              </ul>

              <div className="mt-5 grid gap-2">
                <Link
                  href="https://wa.me/51908577861"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Escribir por WhatsApp
                </Link>

                <Link
                  href="mailto:ventas@tecnohouse.pe?subject=Consulta%20TecnoHouse"
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Enviar correo
                </Link>

                <Link
                  href="https://www.facebook.com/profile.php?id=61583297501092"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Facebook oficial
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="pb-14">
        <Container>
          <div className="rounded-3xl border bg-gradient-to-br from-white to-gray-50 p-7 text-center shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold">
              ¿Necesitas ayuda ahora mismo?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Respondemos más rápido por WhatsApp.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="https://wa.me/51908577861"
                target="_blank"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Abrir WhatsApp
              </Link>

              <Link
                href="/ayuda"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Ir a Ayuda
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
