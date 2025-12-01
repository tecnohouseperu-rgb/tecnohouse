// app/quienes-somos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"; // <-- IMPORT NECESARIO

export const metadata: Metadata = {
  title: "¿Quiénes Somos? | TecnoHouse Perú",
  description:
    "Conoce quiénes somos en TecnoHouse Perú: misión, visión, valores, cobertura, y por qué miles confían en nosotros.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: {
    title: "¿Quiénes Somos? | TecnoHouse Perú",
    description:
      "Conoce nuestra historia, valores y compromiso con un ecommerce de tecnología confiable.",
    url: "/quienes-somos",
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

function Badge({ children }: any) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-medium shadow-sm">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}

export default function QuienesSomosPage() {
  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TecnoHouse Perú",
            url: "https://www.tecnohouse.pe/",
            logo: "https://www.tecnohouse.pe/tecnohouse.svg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Vulcano 127, ATE",
              addressLocality: "Lima",
              addressCountry: "PE",
            },
            sameAs: ["https://facebook.com", "https://instagram.com", "https://tiktok.com"],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: "+51 908577861",
              areaServed: "PE",
              availableLanguage: ["es"],
            },
          }),
        }}
      />

      {/* HERO */}
      <header className="relative overflow-hidden border-b bg-gradient-to-b from-white to-gray-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_400px_at_50%_-200px,rgba(59,130,246,0.12),transparent)]"
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
              <li className="text-foreground">¿Quiénes somos?</li>
            </ol>
          </nav>

          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Tecnología confiable para todo el Perú
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Nacimos con una idea simple: compras fáciles, soporte real y
                entregas rápidas. Hoy miles de clientes nos eligen por nuestra
                curaduría de productos y una post-venta que sí responde.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge>🚚 Envíos a todo el país</Badge>
                <Badge>🛡️ Garantía en cada producto</Badge>
                <Badge>💬 Soporte por WhatsApp</Badge>
              </div>
              <div className="mt-6 flex gap-2">
                <Link
                  href="/categorias"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/60"
                >
                  Explorar categorías
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

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Clientes satisfechos" value="+10,000" />
            <Stat label="Categorías" value="12+" />
            <Stat label="Años de experiencia" value="5+" />
            <Stat label="Cobertura" value="Todo el Perú" />
          </div>
        </Container>
      </header>

      {/* PROPUESTA DE VALOR */}
      <Section
        title="Por qué elegir TecnoHouse"
        subtitle="Nuestra propuesta combina mejor precio–beneficio con una experiencia de compra clara y sin fricciones."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Curaduría de productos"
            desc="Traemos modelos con buena relación costo/beneficio. Menos ruido, más aciertos."
          />
          <FeatureCard
            title="Entrega rápida"
            desc="Despacho en 24–48h en Lima y envíos seguros a todo el país."
          />
          <FeatureCard
            title="Pagos seguros"
            desc="Tarjetas, transferencias y Mercado Pago. Comprobantes y seguimiento."
          />
          <FeatureCard
            title="Soporte post-venta"
            desc="Respuestas reales por WhatsApp. Garantía efectiva ante cualquier defecto."
          />
        </div>
      </Section>

      {/* MISIÓN + VISIÓN */}
      <Section title="Misión y visión">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Misión</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Acercar tecnología confiable a personas y negocios del Perú,
              con información clara, precios justos y soporte cercano.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Visión</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Convertirnos en el ecommerce peruano de referencia en electrónica
              y hogar inteligente, reconocidos por la experiencia y la confianza.
            </p>
          </div>
        </div>
      </Section>

      {/* LÍNEA DE TIEMPO */}
      <Section title="Nuestra historia" subtitle="Un camino construido con clientes reales.">
        <ol className="relative border-s pl-6">
          {[
            { year: "2019", title: "Primer catálogo", text: "Iniciamos con audio y accesorios; foco 100% en atención personalizada." },
            { year: "2021", title: "Cobertura nacional", text: "Optimización logística y nuevas alianzas para envíos a provincia." },
            { year: "2023", title: "Smart Home & Gamer", text: "Ampliamos líneas con productos para casa inteligente y gaming." },
            { year: "2025", title: "Experiencia pro", text: "Nuevo ecommerce, mejores políticas, garantía ágil y tracking claro." },
          ].map((i, idx) => (
            <li key={idx} className="mb-8 ms-4">
              <div className="absolute -start-1.5 h-3 w-3 rounded-full border bg-white" />
              <div className="rounded-xl border bg-white/70 p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{i.year}</p>
                <p className="text-sm font-semibold">{i.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{i.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* TESTIMONIOS */}
      <Section title="Lo que dicen nuestros clientes">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "María G.", quote: "Llegó rapidísimo y el soporte contestó mis dudas al toque. Recomendado." },
            { name: "Luis R.", quote: "El parlante salió buenazo. Precio justo y me dieron boleta y seguimiento." },
            { name: "Ana P.", quote: "Compré reloj inteligente y todo ok. La garantía fue real cuando lo necesité." },
          ].map((t, i) => (
            <figure key={i} className="rounded-2xl border bg-white/70 p-5 shadow-sm">
              <blockquote className="text-sm text-muted-foreground">“{t.quote}”</blockquote>
              <figcaption className="mt-3 text-sm font-medium">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* DÓNDE ENCONTRARNOS */}
      <Section title="Dónde encontrarnos">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">Dirección</p>
            <p className="font-medium">Vulcano 127, ATE – Lima</p>
            <p className="text-sm text-muted-foreground">(A unas puertas de Todo Remate)</p>
            <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg border">
              <iframe
                title="Mapa TecnoHouse"
                className="h-full w-full"
                loading="lazy"
                src="https://maps.google.com/maps?q=Vulcano%20127%20ATE%20Lima&z=16&output=embed"
              />
            </div>
          </div>
          <div className="rounded-2xl border bg-white/70 p-5 shadow-sm space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
              <Link
                href="https://wa.me/51908577861"
                target="_blank"
                className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
              >
                +51 908 577 861
              </Link>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Horario</p>
              <p className="text-sm">Lun–Sáb: 10:00–19:00</p>
              <p className="text-sm">Dom: 11:00–17:00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Correo</p>
              <p className="text-sm">ventas@tecnohouse.pe</p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA FINAL */}
      <section className="pb-14">
        <Container>
          <div className="rounded-3xl border bg-gradient-to-br from-white to-gray-50 p-7 text-center shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold">¿Listo para comprar?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Explora Audio, Celulares, Gamer y más. Envíos a todo el Perú.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="/categorias"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Ver categorías
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
