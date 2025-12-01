// app/garantia/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Garantía | TecnoHouse Perú",
  description:
    "Política de garantía y soporte técnico de TecnoHouse Perú. Plazos por categoría, qué cubre la garantía y cómo solicitarla.",
  alternates: { canonical: "/garantia" },
  openGraph: {
    title: "Garantía | TecnoHouse Perú",
    description:
      "Conoce cómo funciona la garantía en TecnoHouse Perú y el paso a paso para realizar un reclamo técnico.",
    url: "/garantia",
    siteName: "TecnoHouse Perú",
    type: "article",
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
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white/70 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function GarantiaPage() {
  return (
    <>
      {/* FAQ Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué necesito para hacer válida la garantía?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Número de pedido, boleta o factura, empaques y accesorios completos, y una descripción clara de la falla.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto tiempo dura la garantía?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Depende de la categoría. Electrónica y electrohogar: 12 meses; audio, gamer y smart home: 6 meses; accesorios: 3 meses; ropa/textil: 7 días por defecto de fábrica. Si la marca indica otro plazo, prevalece el de la marca.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué no cubre la garantía?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Daños por golpes, humedad o líquidos, mal uso, manipulación no autorizada, instalaciones incorrectas y desgaste normal.",
                },
              },
            ],
          }),
        }}
      />

      {/* Hero / encabezado */}
      <header className="border-b bg-gradient-to-b from-white to-gray-50">
        <Container className="py-8 md:py-10">
          <nav className="text-xs md:text-sm text-muted-foreground mb-3">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Garantía</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Garantía & Soporte Técnico
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Nuestro objetivo es que tengas una experiencia segura y sin fricciones.
            Aquí encontrarás los plazos por categoría, qué cubre la garantía y cómo
            solicitarla.
          </p>
        </Container>
      </header>

      <main>
        <section className="py-8 lg:py-12">
          <Container className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
            {/* Plazos por categoría */}
            <Card>
              <h2 className="text-xl md:text-2xl font-semibold">Plazos por categoría</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Si el fabricante indica un plazo distinto al listado,{" "}
                <span className="font-medium text-foreground">prevalece el de la marca</span>.
              </p>

              <div className="mt-4 overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium">Categoría</th>
                      <th className="px-4 py-3 font-medium">Plazo de garantía</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">Electrónica & Electrohogar</td>
                      <td className="px-4 py-3">12 meses</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">Audio, Gamer & Smart Home</td>
                      <td className="px-4 py-3">6 meses</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">Accesorios y Cables</td>
                      <td className="px-4 py-3">3 meses</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">Textiles (p. ej. pijamas)</td>
                      <td className="px-4 py-3">7 días por defecto de fábrica</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                <li>• El plazo se cuenta desde la fecha de emisión de la boleta/factura.</li>
                <li>• Se requiere empaque y accesorios para reposición o cambio.</li>
              </ul>
            </Card>

            {/* Qué cubre / no cubre */}
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl md:text-2xl font-semibold">¿Qué cubre?</h2>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Defectos de fabricación y fallas técnicas no atribuibles al uso.</li>
                  <li>Componentes con mal funcionamiento dentro del plazo de garantía.</li>
                  <li>Productos que no encienden o presentan fallas de fábrica repetibles.</li>
                </ul>
              </Card>

              <Card>
                <h2 className="text-xl md:text-2xl font-semibold">¿Qué no cubre?</h2>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Golpes, caídas, fisuras, humedad o contacto con líquidos.</li>
                  <li>Mal uso, sobrecarga eléctrica, instalación/actualización no autorizada.</li>
                  <li>Manipulaciones por servicios técnicos no autorizados.</li>
                  <li>Desgaste normal (baterías, cables pelados, marcas de uso).</li>
                  <li>Falta de accesorios, empaques o número de serie alterado.</li>
                </ul>
              </Card>
            </div>
          </Container>
        </section>

        {/* Proceso de garantía */}
        <section className="py-6 lg:py-10 border-t bg-white">
          <Container>
            <h2 className="text-xl md:text-2xl font-semibold">¿Cómo solicitar la garantía?</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <p className="text-sm font-medium">1) Reúne la información</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Número de pedido, boleta/factura, fotos o video de la falla y una
                  breve descripción del problema.
                </p>
              </Card>
              <Card>
                <p className="text-sm font-medium">2) Contáctanos</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escríbenos por WhatsApp para registrar el caso y recibir
                  instrucciones.
                </p>
                <div className="mt-3">
                  <Link
                    href="https://wa.me/51908577861?text=Hola%20TecnoHouse,%20necesito%20soporte%20de%20garant%C3%ADa."
                    target="_blank"
                    className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-muted/70"
                  >
                    WhatsApp: +51 908 577 861
                  </Link>
                </div>
              </Card>
              <Card>
                <p className="text-sm font-medium">3) Envío o entrega</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Podrás enviar el producto o acercarlo a tienda con su empaque y
                  accesorios. Dirección: <span className="font-medium">Vulcano 127, ATE – Lima</span>.
                </p>
              </Card>
              <Card>
                <p className="text-sm font-medium">4) Evaluación y solución</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nuestro servicio técnico (o el del fabricante) evalúa el equipo y
                  procede con reparación, cambio o nota de crédito según corresponda.
                </p>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <h3 className="text-base font-semibold">Tiempos & costos</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Diagnóstico: 3–7 días hábiles (aprox.).</li>
                  <li>
                    Transporte: si el producto debe enviarse al centro técnico, el
                    flete puede ser asumido por el cliente (según caso/marca).
                  </li>
                  <li>
                    Si la falla es de fábrica, la reparación o cambio no genera
                    costo para el cliente.
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-base font-semibold">Requisitos</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Boleta o factura y número de pedido.</li>
                  <li>Accesorios y empaques completos en buen estado.</li>
                  <li>Producto sin golpes, humedad ni manipulación no autorizada.</li>
                </ul>
              </Card>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/ayuda"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Centro de ayuda
              </Link>
              <Link
                href="mailto:ventas@tecnohouse.pe?subject=Garant%C3%ADa%20-%20TecnoHouse"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Escribir al correo
              </Link>
              <Link
                href="https://wa.me/51908577861?text=Hola%20TecnoHouse,%20necesito%20soporte%20de%20garant%C3%ADa."
                target="_blank"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70"
              >
                Abrir WhatsApp
              </Link>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
