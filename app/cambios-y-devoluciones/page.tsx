// app/cambios-y-devoluciones/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones | TecnoHouse Perú",
  description:
    "Revisa nuestras políticas de cambios, devoluciones y garantías. Transparencia total para una compra segura.",
  alternates: { canonical: "/cambios-y-devoluciones" },
};

function Container({ children, className = "" }: any) {
  return (
    <div className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function H2({ children }: any) {
  return (
    <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
      {children}
    </h2>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-2xl border bg-white/70 p-5 shadow-sm">
      {title && <p className="text-sm font-semibold mb-1">{title}</p>}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export default function CambiosPage() {
  const lastUpdated = "08/11/2025"; // ajusta cuando actualices
  return (
    <main className="pb-12">
      {/* HERO */}
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
              <li className="text-foreground">Cambios y Devoluciones</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cambios y Devoluciones
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {lastUpdated}
          </p>
        </Container>
      </header>

      <Container className="pt-8 md:pt-10 space-y-10">
        {/* INTRO */}
        <section>
          <p className="text-sm text-muted-foreground">
            En TecnoHouse Perú queremos que tengas una compra segura y sin
            complicaciones. Si tu producto presenta fallas, llegó con defectos o
            deseas gestionar un cambio, aquí encontrarás toda la información.
          </p>
        </section>

        {/* SECCIÓN 1 */}
        <section>
          <H2>1. ¿En qué casos puedo solicitar un cambio?</H2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Puedes solicitar un cambio si:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>El producto presenta falla de fábrica dentro del periodo de garantía.</li>
              <li>El producto llegó dañado o incompleto.</li>
              <li>Recibiste un producto distinto al solicitado.</li>
            </ul>
            <p>
              Los cambios aplican únicamente si el producto está en buen estado,
              con empaques completos y accesorios originales.
            </p>
          </div>
        </section>

        {/* SECCIÓN 2 */}
        <section>
          <H2>2. ¿En qué casos NO procede un cambio?</H2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Cuando el producto presenta golpes, humedad o mal uso.</li>
            <li>Si han pasado más de 7 días desde la entrega para cambios por disconformidad.</li>
            <li>Cuando el producto no conserva empaques, accesorios o sellos de garantía.</li>
            <li>Si el producto fue manipulado por un técnico externo.</li>
          </ul>
        </section>

        {/* SECCIÓN 3 */}
        <section>
          <H2>3. Devoluciones y Reembolsos</H2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Las devoluciones aplican únicamente cuando el producto presenta un
              defecto que no puede ser solucionado mediante reparación o cambio.
            </p>
            <p>
              El reembolso se realiza por el mismo medio de pago usado en la
              compra. El plazo aproximado es entre 3 y 10 días hábiles,
              dependiendo del banco o método.
            </p>
          </div>
        </section>

        {/* SECCIÓN 4 */}
        <section>
          <H2>4. Tiempo para solicitar un cambio o revisión</H2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Cuentas con los siguientes plazos:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>7 días para cambios por disconformidad.</li>
              <li>
                30 días para reportar productos defectuosos cubiertos por
                garantía inmediata.
              </li>
              <li>Para garantías extendidas, se aplica la cobertura del fabricante.</li>
            </ul>
          </div>
        </section>

        {/* SECCIÓN 5 */}
        <section>
          <H2>5. Costos de envío por cambios</H2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Lima Metropolitana">
              El costo del recojo o reenvío varía entre S/ 10.00 y S/ 15.00 según
              distrito. Si el error es nuestro, el costo es totalmente cubierto.
            </Card>

            <Card title="Provincias">
              El cliente puede enviar el producto mediante la agencia de su elección.
              Si el producto llegó defectuoso, devolvemos el costo del envío.
            </Card>
          </div>
        </section>

        {/* SECCIÓN 6 */}
        <section>
          <H2>6. ¿Cómo iniciar un cambio o devolución?</H2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Contáctanos con la siguiente información:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombre completo</li>
              <li>Número de pedido</li>
              <li>Descripción del problema</li>
              <li>Fotos o video del producto</li>
            </ul>
            <p>
              Escríbenos por WhatsApp al{" "}
              <span className="font-medium">+51 908 577 861</span> o al correo{" "}
              <span className="font-medium">ventas@tecnohouse.pe</span>.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section>
          <div className="rounded-2xl border bg-gradient-to-r from-white to-gray-50 p-6 text-center shadow-sm">
            <h3 className="text-lg md:text-xl font-bold">
              ¿Necesitas ayuda con tu garantía?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Nuestro equipo está listo para ayudarte.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Link
                href="/ayuda"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
              >
                Centro de Ayuda
              </Link>
              <a
                href="https://wa.me/51908577861"
                target="_blank"
                className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/60"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
