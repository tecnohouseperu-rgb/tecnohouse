import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nuestras Tiendas | TecnoHouse Perú",
  description: "Dirección, horario y cómo llegar a nuestra tienda.",
  alternates: { canonical: "/tiendas" },
};

function Container({ children, className = "" }: any) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-medium">{value}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Container className="py-10 md:py-12">
      <nav className="text-xs md:text-sm text-muted-foreground mb-3">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:underline">Inicio</Link></li>
          <li>/</li>
          <li className="text-foreground">Nuestras Tiendas</li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nuestras Tiendas</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Ven a recoger tu pedido, ver productos y recibir asesoría.
      </p>

      <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">TecnoHouse Perú – ATE</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Info label="Dirección" value="Vulcano 127, ATE – Lima" />
            <Info label="Horario" value="Lun–Sáb 09:00–17:00" />
            <Info label="Contacto" value="+51 908 577 861 (WhatsApp)" />
          </div>

          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg border">
            <iframe
              title="Mapa TecnoHouse ATE"
              className="h-full w-full"
              loading="lazy"
              src="https://maps.google.com/maps?q=Vulcano%20127%20ATE%20Lima&z=16&output=embed"
            />
          </div>

          <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-sm">
            <p className="font-medium">Recojo en tienda</p>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              <li>Traer DNI o código de pedido.</li>
              <li>Te avisamos por WhatsApp cuando esté listo.</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold">¿Necesitas ayuda?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Escríbenos y te guiamos con rutas y tiempos.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="https://wa.me/51908577861" target="_blank" className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70">
              WhatsApp
            </Link>
            <Link href="https://www.facebook.com/profile.php?id=61583297501092" target="_blank" className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted/70">
              Facebook
            </Link>
            <span className="inline-flex rounded-md border px-4 py-2 text-sm">ventas@tecnohouse.pe</span>
          </div>
        </aside>
      </section>
    </Container>
  );
}
