// app/politicas-de-privacidad/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Políticas de Privacidad | TecnoHouse Perú",
  description:
    "Conoce cómo TecnoHouse Perú recopila, almacena, protege y utiliza tu información personal según la normativa peruana.",
  alternates: { canonical: "/politicas-de-privacidad" },
  openGraph: {
    title: "Políticas de Privacidad | TecnoHouse Perú",
    description:
      "Información clara sobre el tratamiento de datos personales en TecnoHouse Perú.",
    url: "/politicas-de-privacidad",
    siteName: "TecnoHouse Perú",
    type: "article",
  },
};

// Layout components
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

export default function PoliticaPrivacidadPage() {
  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            name: "Política de Privacidad TecnoHouse Perú",
            url: "https://www.tecnohouse.pe/politicas-de-privacidad",
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
              <li className="text-foreground">Políticas de Privacidad</li>
            </ol>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Políticas de Privacidad
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            En TecnoHouse Perú respetamos tu privacidad. Esta política explica
            cómo recopilamos, usamos y protegemos tu información personal,
            cumpliendo con la Ley N.º 29733 – Ley de Protección de Datos
            Personales del Perú.
          </p>
        </Container>
      </header>

      <main>
        <Container className="py-8 md:py-12">
          {/* INDEX */}
          <aside className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium mb-2">Contenido</p>
            <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              {[
                ["info", "1. Información que recopilamos"],
                ["uso", "2. Cómo usamos tus datos"],
                ["finalidad", "3. Finalidad del tratamiento"],
                ["compartir", "4. Compartición con terceros"],
                ["seguridad", "5. Seguridad y protección"],
                ["derechos", "6. Derechos del usuario"],
                ["cookies", "7. Cookies y tecnologías"],
                ["retencion", "8. Tiempo de almacenamiento"],
                ["menores", "9. Información de menores"],
                ["cambios", "10. Cambios en la política"],
                ["contacto", "11. Contacto"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a className="hover:underline" href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* SECTIONS */}
          <Section id="info" title="1. Información que recopilamos">
            <ul>
              <li>Nombres y apellidos.</li>
              <li>Número de documento (opcional según caso).</li>
              <li>Correo electrónico y teléfono.</li>
              <li>Dirección para envíos.</li>
              <li>Método de pago usado (sin almacenar datos de tarjeta).</li>
              <li>Datos de navegación para mejoras del sitio.</li>
            </ul>
          </Section>

          <Section id="uso" title="2. Cómo usamos tu información">
            <ul>
              <li>Procesar compras y envíos.</li>
              <li>Emitir comprobantes de pago.</li>
              <li>Atender consultas por WhatsApp o correo.</li>
              <li>Mejorar la experiencia de navegación.</li>
              <li>Verificar pagos y evitar fraudes.</li>
            </ul>
          </Section>

          <Section id="finalidad" title="3. Finalidad del tratamiento">
            <p>
              La información se utiliza únicamente para fines comerciales,
              logísticos y de soporte al cliente. No vendemos ni alquilamos tus
              datos.
            </p>
          </Section>

          <Section id="compartir" title="4. Compartición con terceros">
            <p>Solo compartimos datos con:</p>
            <ul>
              <li>Empresas de delivery (Urbano, Shalom u otras).</li>
              <li>Entidades financieras para procesar pagos.</li>
              <li>Proveedores tecnológicos (hosting, CRM, WhatsApp API).</li>
            </ul>
            <p>No compartimos información con terceros no autorizados.</p>
          </Section>

          <Section id="seguridad" title="5. Seguridad y protección de datos">
            <p>
              Implementamos medidas físicas, digitales y administrativas para
              proteger tu información contra accesos no autorizados.
            </p>
          </Section>

          <Section id="derechos" title="6. Derechos del usuario">
            <p>Puedes solicitar en cualquier momento:</p>
            <ul>
              <li>Acceso a tus datos.</li>
              <li>Corrección o actualización.</li>
              <li>Eliminación o cancelación.</li>
              <li>Oposición al uso de tus datos.</li>
            </ul>
            <p>
              Para ejercer tus derechos, escríbenos a{" "}
              <span className="font-medium">ventas@tecnohouse.pe</span>.
            </p>
          </Section>

          <Section id="cookies" title="7. Cookies y tecnologías similares">
            <p>
              Usamos cookies para mejorar tu experiencia, recordar preferencias
              y analizar el rendimiento del sitio. Puedes desactivarlas en tu
              navegador.
            </p>
          </Section>

          <Section id="retencion" title="8. Tiempo de almacenamiento de datos">
            <p>
              Conservamos tu información el tiempo necesario para completar
              ventas, realizar soporte y cumplir obligaciones legales.
            </p>
          </Section>

          <Section id="menores" title="9. Información de menores de edad">
            <p>
              No recopilamos datos de menores de 18 años sin autorización de sus
              padres o tutores.
            </p>
          </Section>

          <Section id="cambios" title="10. Cambios en la política de privacidad">
            <p>
              Esta política puede actualizarse. Cualquier cambio será publicado
              en esta página.
            </p>
          </Section>

          <Section id="contacto" title="11. Contacto">
            <ul>
              <li>
                WhatsApp:{" "}
                <Link
                  href="https://wa.me/51908577861"
                  className="underline"
                  target="_blank"
                >
                  +51 908 577 861
                </Link>
              </li>
              <li>
                Facebook:{" "}
                <Link
                  href="https://www.facebook.com/profile.php?id=61583297501092"
                  className="underline"
                  target="_blank"
                >
                  @TecnoHousePeru
                </Link>
              </li>
              <li>
                Correo:{" "}
                <span className="font-medium">ventas@tecnohouse.pe</span>
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
