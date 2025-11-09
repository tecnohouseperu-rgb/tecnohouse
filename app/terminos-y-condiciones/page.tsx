// app/terminos-y-condiciones/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | TecnoHouse Perú",
  description:
    "Términos y Condiciones de uso, compras, envíos y garantías de TecnoHouse Perú. Lee nuestras políticas de funcionamiento y tu experiencia de compra.",
  alternates: { canonical: "/terminos-y-condiciones" },
  openGraph: {
    title: "Términos y Condiciones | TecnoHouse Perú",
    description: "Información completa sobre el uso y compra en TecnoHouse Perú.",
    url: "/terminos-y-condiciones",
    siteName: "TecnoHouse Perú",
    type: "article",
  },
};

// Componentes de layout
function Container({ children, className = "" }: any) {
  return (
    <div className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
        {title}
      </h2>
      <div className="prose prose-sm md:prose-base max-w-none text-foreground/90">
        {children}
      </div>
      <hr className="my-6 border-dashed" />
    </section>
  );
}

export default function TerminosCondicionesPage() {
  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Términos y Condiciones TecnoHouse Perú",
            url: "https://www.tecnohouse.pe/terminos-y-condiciones",
            inLanguage: "es-PE",
            publisher: { "@type": "Organization", name: "TecnoHouse Perú" },
          }),
        }}
      />

      <header className="border-b bg-gradient-to-b from-white to-gray-50">
        <Container className="py-8 md:py-10">
          <nav className="text-xs md:text-sm text-muted-foreground mb-2">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Términos y Condiciones</li>
            </ol>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Términos y Condiciones
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Este documento establece las reglas de uso, compras, envíos,
            garantías y responsabilidades relacionadas con el uso de TecnoHouse
            Perú. Por favor, léelo atentamente antes de realizar una compra o
            usar nuestros servicios.
          </p>
        </Container>
      </header>

      <main>
        <Container className="py-8 md:py-12">
          {/* Índice */}
          <aside className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium mb-2">Contenido</p>
            <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              {[
                ["uso", "1. Uso del sitio"],
                ["compras", "2. Condiciones de compra"],
                ["precios", "3. Precios y disponibilidad"],
                ["envios", "4. Envíos y tiempos de entrega"],
                ["pagos", "5. Métodos de pago"],
                ["garantias", "6. Garantías y devoluciones"],
                ["responsabilidad", "7. Limitación de responsabilidad"],
                ["privacidad", "8. Privacidad y datos personales"],
                ["modificaciones", "9. Modificaciones del servicio"],
                ["contacto", "10. Contacto y Atención"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a className="hover:underline" href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* SECCIONES */}
          <Section id="uso" title="1. Uso del sitio">
            <ul>
              <li>
                El acceso a nuestra web implica la aceptación de estos Términos
                y Condiciones.
              </li>
              <li>
                No está permitido utilizar el sitio con fines fraudulentos,
                maliciosos o para interferir con su funcionamiento.
              </li>
            </ul>
          </Section>

          <Section id="compras" title="2. Condiciones de compra">
            <ul>
              <li>
                Para realizar una compra debes proporcionar datos reales y
                verificables.
              </li>
              <li>
                Toda compra se considera confirmada únicamente cuando el
                cliente recibe su comprobante de pago.
              </li>
              <li>
                Los pedidos están sujetos a validación de stock.
              </li>
            </ul>
          </Section>

          <Section id="precios" title="3. Precios y disponibilidad">
            <ul>
              <li>
                Los precios publicados incluyen IGV, salvo indicación específica.
              </li>
              <li>
                Los productos pueden variar en disponibilidad sin previo aviso.
              </li>
              <li>
                Promociones, cupones y descuentos tienen vigencia limitada.
              </li>
            </ul>
          </Section>

          <Section id="envios" title="4. Envíos y tiempos de entrega">
            <ul>
              <li>
                Envíos a Lima Metropolitana y Rural: costo fijo según{" "}
                <Link href="/delivery" className="underline">
                  nuestra cobertura de delivery
                </Link>
                .
              </li>
              <li>
                Envíos a provincias vía Shalom u otra agencia elegida por el
                cliente.
              </li>
              <li>
                Los tiempos pueden variar por demanda, climatología o
                disponibilidad de mensajería.
              </li>
            </ul>
          </Section>

          <Section id="pagos" title="5. Métodos de pago">
            <p>
              Aceptamos tarjetas, transferencias bancarias, Yape, Plin, PagoEfectivo
              y Mercado Pago. (Ver{" "}
              <Link href="/metodos-de-pago" className="underline">
                métodos de pago
              </Link>
              ).
            </p>
          </Section>

          <Section id="garantias" title="6. Garantías y devoluciones">
            <p>
              Toda compra está cubierta por nuestra política de garantía. Revisa
              los detalles en{" "}
              <Link href="/garantia" className="underline">
                Garantía y Post-venta
              </Link>
              .
            </p>
          </Section>

          <Section id="responsabilidad" title="7. Limitación de responsabilidad">
            <p>
              TecnoHouse Perú no se responsabiliza por daños indirectos,
              incidentales o pérdida de información derivada del uso del sitio.
            </p>
          </Section>

          <Section id="privacidad" title="8. Privacidad y datos personales">
            <p>
              El manejo de datos se rige por nuestra{" "}
              <Link href="/politica-de-privacidad" className="underline">
                Política de Privacidad
              </Link>
              . El usuario puede solicitar acceso, corrección o eliminación de
              su información.
            </p>
          </Section>

          <Section id="modificaciones" title="9. Modificaciones del servicio">
            <p>
              TecnoHouse Perú podrá actualizar precios, políticas o contenido
              del sitio sin previo aviso cuando sea necesario.
            </p>
          </Section>

          <Section id="contacto" title="10. Contacto y Atención al Cliente">
            <ul>
              <li>
                WhatsApp:{" "}
                <Link
                  href="https://wa.me/51902138542"
                  target="_blank"
                  className="underline"
                >
                  +51 902 138 542
                </Link>
              </li>
              <li>
                Facebook:{" "}
                <Link
                  href="https://www.facebook.com/profile.php?id=61583297501092"
                  target="_blank"
                  className="underline"
                >
                  @TecnoHousePeru
                </Link>
              </li>
              <li>
                Centro de Ayuda:{" "}
                <Link href="/ayuda" className="underline">
                  /ayuda
                </Link>
              </li>
            </ul>
          </Section>

          <p className="text-xs text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-PE")}
          </p>
        </Container>
      </main>
    </>
  );
}
