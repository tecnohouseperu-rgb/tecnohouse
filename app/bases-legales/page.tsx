// app/bases-legales/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bases Legales | TecnoHouse Perú",
  description:
    "Bases legales de campañas, sorteos y promociones de TecnoHouse Perú: condiciones, vigencia, cobertura, restricciones y atención al cliente.",
  alternates: { canonical: "/bases-legales" },
  openGraph: {
    title: "Bases Legales | TecnoHouse Perú",
    description:
      "Consulta las bases legales aplicables a nuestras promociones y sorteos.",
    url: "/bases-legales",
    siteName: "TecnoHouse Perú",
    type: "article",
  },
};

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

export default function BasesLegalesPage() {
  return (
    <>
      {/* Schema.org (CreativeWork) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Bases Legales TecnoHouse Perú",
            url: "https://www.tecnohouse.pe/bases-legales",
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
                <Link className="hover:underline" href="/">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Bases Legales</li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Bases Legales
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Este documento regula las condiciones generales aplicables a
            promociones, campañas y sorteos de TecnoHouse Perú (“La Empresa”).
            Cada acción comercial puede incluir reglas específicas adicionales,
            las cuales complementan lo aquí indicado.
          </p>
        </Container>
      </header>

      <main>
        <Container className="py-8 md:py-12">
          {/* Índice rápido */}
          <aside className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium mb-2">Contenido</p>
            <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              {[
                ["vigencia", "1. Vigencia"],
                ["ambito", "2. Ámbito & Cobertura"],
                ["participacion", "3. Participación & Elegibilidad"],
                ["mecanica", "4. Mecánica & Premios"],
                ["exclusiones", "5. Exclusiones & Restricciones"],
                ["entrega", "6. Entrega y Canje"],
                ["cambios", "7. Cambios, Devoluciones y Garantías"],
                ["datos", "8. Tratamiento de Datos"],
                ["modificaciones", "9. Modificaciones & Cancelación"],
                ["contacto", "10. Canales de Atención"],
                ["aceptacion", "11. Aceptación de Bases"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a className="hover:underline" href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <Section id="vigencia" title="1. Vigencia">
            <ul>
              <li>
                Cada promoción indicará su fecha y hora de inicio y fin. Salvo
                indicación distinta, se considera horario de Lima (GMT-5).
              </li>
              <li>
                Promociones “hasta agotar stock” finalizan cuando se termine el
                inventario asignado aun si la fecha de fin no hubiera llegado.
              </li>
            </ul>
          </Section>

          <Section id="ambito" title="2. Ámbito & Cobertura">
            <ul>
              <li>
                Válido para compras realizadas en{" "}
                <span className="font-medium">TecnoHouse Perú</span> (web/app) y
                en los puntos de venta físicos informados por la Empresa.
              </li>
              <li>
                Cobertura de envíos: todo el Perú (ver{" "}
                <Link href="/delivery" className="underline">
                  Cobertura de Delivery
                </Link>
                ).
              </li>
            </ul>
          </Section>

          <Section id="participacion" title="3. Participación & Elegibilidad">
            <ul>
              <li>Podrán participar personas naturales mayores de 18 años.</li>
              <li>
                El cliente debe cumplir las condiciones publicadas (monto
                mínimo, categorías participantes, fechas, etc.).
              </li>
              <li>
                La Empresa puede requerir documento de identidad y/o comprobante
                de pago para validar participación y entrega.
              </li>
            </ul>
          </Section>

          <Section id="mecanica" title="4. Mecánica & Premios">
            <ul>
              <li>
                La mecánica y premios (si los hubiese) se especifican en el
                arte o página de la campaña. Los premios son intransferibles y
                no canjeables por dinero.
              </li>
              <li>
                De existir sorteo, se realizará en la fecha indicada y se
                contactará al ganador por los medios registrados (WhatsApp,
                correo o teléfono) dentro de un plazo razonable.
              </li>
              <li>
                Si el ganador no responde dentro del plazo comunicado, se
                podrá realizar un nuevo sorteo o declarar desierto, según bases
                específicas de la campaña.
              </li>
            </ul>
          </Section>

          <Section id="exclusiones" title="5. Exclusiones & Restricciones">
            <ul>
              <li>Promociones no acumulables con otras ofertas o cupones.</li>
              <li>
                No aplica para compras mayoristas o con fines de reventa, salvo
                que se indique lo contrario.
              </li>
              <li>
                Imágenes referenciales. Especificaciones, stock y colores están
                sujetos a variación.
              </li>
            </ul>
          </Section>

          <Section id="entrega" title="6. Entrega y Canje">
            <ul>
              <li>
                Envíos a Lima Metropolitana y Rural: costo uniforme si así se
                indica en la página de Delivery. Provincias mediante agencias
                logísticas informadas.
              </li>
              <li>
                Para canjes presenciales (si aplica), el ganador debe acudir con
                su documento de identidad. Si envía a un tercero, deberá
                presentar carta poder simple y copia de DNI.
              </li>
            </ul>
          </Section>

          <Section id="cambios" title="7. Cambios, Devoluciones y Garantías">
            <ul>
              <li>
                Se aplican las políticas de{" "}
                <Link href="/garantia" className="underline">
                  Garantía y Post-venta
                </Link>{" "}
                vigentes.
              </li>
              <li>
                Productos con fallas de fábrica podrán gestionarse conforme a la
                garantía del fabricante o la de la tienda, según corresponda.
              </li>
            </ul>
          </Section>

          <Section id="datos" title="8. Tratamiento de Datos Personales">
            <p>
              El participante autoriza el tratamiento de sus datos para fines
              vinculados a la campaña y comunicaciones comerciales de
              TecnoHouse. Puede ejercer sus derechos ARCO escribiendo a los
              canales de atención indicados abajo. (Ver{" "}
              <Link href="/politica-de-privacidad" className="underline">
                Política de Privacidad
              </Link>
              ).
            </p>
          </Section>

          <Section id="modificaciones" title="9. Modificaciones & Cancelación">
            <p>
              La Empresa podrá modificar, suspender o cancelar la promoción por
              caso fortuito, fuerza mayor, error material evidente o hechos no
              imputables, informándolo por los mismos medios de difusión de la
              campaña.
            </p>
          </Section>

          <Section id="contacto" title="10. Canales de Atención">
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
                Página de ayuda: <Link href="/ayuda" className="underline">/ayuda</Link>
              </li>
            </ul>
          </Section>

          <Section id="aceptacion" title="11. Aceptación de Bases">
            <p>
              La participación en cualquier promoción implica el conocimiento y
              aceptación íntegra de estas bases legales y de las condiciones
              específicas de cada campaña.
            </p>
          </Section>

          {/* Nota final */}
          <p className="text-xs text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-PE")}
          </p>
        </Container>
      </main>
    </>
  );
}
