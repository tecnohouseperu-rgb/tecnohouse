// app/cookies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies | TecnoHouse Perú",
  description:
    "Conoce qué son las cookies, cómo las usamos en TecnoHouse Perú y cómo puedes gestionarlas desde tu navegador o preferencias.",
  alternates: { canonical: "/cookies" },
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
      {title ? <p className="text-sm font-semibold mb-1">{title}</p> : null}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export default function CookiesPage() {
  const lastUpdated = "08/11/2025"; // ajusta esta fecha cuando cambies la política
  return (
    <main className="pb-12">
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
              <li className="text-foreground">Política de Cookies</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Política de Cookies
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {lastUpdated}
          </p>
        </Container>
      </header>

      <Container className="pt-8 md:pt-10 space-y-8">
        <section>
          <H2>1. ¿Qué son las cookies?</H2>
          <p className="text-sm text-muted-foreground">
            Las cookies son pequeños archivos de texto que un sitio web guarda
            en tu navegador para recordar información sobre tu visita. Pueden
            servir para mantener tu sesión, guardar tu carrito, entender cómo
            navegas el sitio y personalizar tu experiencia.
          </p>
        </section>

        <section>
          <H2>2. ¿Qué cookies utilizamos?</H2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Esenciales (necesarias)">
              Permiten que el sitio funcione (por ejemplo, sesión, seguridad,
              mantener el carrito). No pueden desactivarse desde nuestros
              sistemas.
            </Card>
            <Card title="De rendimiento/analítica">
              Nos ayudan a medir visitas y rendimiento para mejorar la
              experiencia (ej.: páginas más visitadas). Se recopila de forma
              agregada.
            </Card>
            <Card title="Funcionales">
              Guardan tus preferencias (idioma, ubicación aproximada,
              recordatorios). Mejoran la personalización sin ser estrictamente
              necesarias.
            </Card>
            <Card title="Marketing">
              Usadas para mostrar ofertas relevantes y medir campañas. Pueden
              provenir de terceros.
            </Card>
          </div>

          <div className="mt-4 rounded-xl border bg-white/70 p-4 text-xs">
            <p className="font-medium mb-2">Ejemplos típicos</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="[&_th]:px-3 [&_th]:py-2 text-muted-foreground">
                    <th>Cookie</th>
                    <th>Tipo</th>
                    <th>Finalidad</th>
                    <th>Duración</th>
                    <th>Propietario</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="[&_td]:px-3 [&_td]:py-2 border-t">
                    <td>th_session</td>
                    <td>Esencial</td>
                    <td>Mantener la sesión iniciada</td>
                    <td>Hasta cerrar sesión</td>
                    <td>TecnoHouse</td>
                  </tr>
                  <tr className="[&_td]:px-3 [&_td]:py-2 border-t">
                    <td>th_cart</td>
                    <td>Esencial</td>
                    <td>Recordar ítems del carrito</td>
                    <td>7 días</td>
                    <td>TecnoHouse</td>
                  </tr>
                  <tr className="[&_td]:px-3 [&_td]:py-2 border-t">
                    <td>analytics_id</td>
                    <td>Rendimiento</td>
                    <td>Métrica de uso del sitio</td>
                    <td>1–12 meses</td>
                    <td>Terceros</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              <span className="italic">
                Nota: la lista anterior es referencial.
              </span>{" "}
              Si añades o quitas integraciones (analítica, chat, marketing),
              actualiza esta tabla con el nombre real, finalidad y duración.
            </p>
          </div>
        </section>

        <section>
          <H2>3. ¿Cómo puedes gestionarlas?</H2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Puedes aceptar o rechazar categorías no esenciales desde nuestro
              banner de consentimiento (si lo mostramos en tu primera visita) o
              cambiando la configuración de tu navegador.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Chrome:</span> Configuración →
                Privacidad y seguridad → Cookies y otros datos de sitios.
              </li>
              <li>
                <span className="font-medium">Safari (iOS/macOS):</span>{" "}
                Preferencias/Configuración → Privacidad → Gestionar cookies.
              </li>
              <li>
                <span className="font-medium">Firefox:</span> Opciones →
                Privacidad y seguridad → Cookies y datos del sitio.
              </li>
              <li>
                <span className="font-medium">Edge:</span> Configuración →
                Privacidad, búsqueda y servicios → Cookies y permisos del sitio.
              </li>
            </ul>
            <p>
              Si bloqueas cookies esenciales, algunas funciones (como el
              carrito o iniciar sesión) podrían no funcionar correctamente.
            </p>
          </div>
        </section>

        <section>
          <H2>4. Cookies de terceros</H2>
          <p className="text-sm text-muted-foreground">
            Algunos proveedores (por ejemplo, pasarelas de pago o herramientas
            de analítica) pueden instalar sus propias cookies cuando interactúas
            con sus servicios en nuestro sitio. Te sugerimos revisar sus
            políticas para más información.
          </p>
        </section>

        <section>
          <H2>5. Cambios en esta política</H2>
          <p className="text-sm text-muted-foreground">
            Podemos actualizar esta política para reflejar cambios legales o
            funcionales del sitio. Publicaremos la versión vigente en esta
            misma página, indicando la fecha de última actualización.
          </p>
        </section>

        <section>
          <H2>6. Contacto</H2>
          <p className="text-sm text-muted-foreground">
            Si tienes consultas sobre cookies o privacidad, escríbenos a{" "}
            <span className="font-medium">ventas@tecnohouse.pe</span> o visita{" "}
            <Link href="/ayuda" className="underline">
              Ayuda
            </Link>
            .
          </p>
        </section>
      </Container>
    </main>
  );
}
