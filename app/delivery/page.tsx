import Image from "next/image";

export const metadata = {
  title: "Cobertura de Delivery | TecnoHouse Perú",
  description:
    "Revisa la cobertura, costos y tiempos de entrega de TecnoHouse Perú. Envíos rápidos a Lima y provincias.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <main className="py-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Cobertura de Delivery
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Realizamos envíos a todas las regiones del Perú con entregas rápidas y seguras.
        Conoce aquí los costos, tiempos y empresas con las que trabajamos.
      </p>

      {/* TARJETA LIMA */}
      <section className="mb-10 rounded-2xl border bg-white/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Delivery en Lima Metropolitana</h2>

        <p className="text-sm text-muted-foreground mb-4">
          Envíos rápidos con entrega puerta a puerta.
        </p>

        <div className="flex items-center gap-4 mb-3">
          <Image
            src="/urbano.svg"
            width={140}
            height={40}
            alt="Urbano Express"
            className="object-contain"
            priority
          />
        </div>

        <p className="text-lg font-semibold text-foreground">S/ 12.00</p>
        <p className="text-sm text-muted-foreground">Costo fijo para todo Lima.</p>
      </section>

      {/* TARJETA PROVINCIAS */}
      <section className="rounded-2xl border bg-white/70 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Envíos a Provincias</h2>

        <p className="text-sm text-muted-foreground mb-4">
          Envíos a todo el Perú mediante agencia.
        </p>

        <div className="flex items-center gap-4 mb-3">
          <Image
            src="/shalom.svg"
            width={160}
            height={44}
            alt="Shalom Cargo"
            className="object-contain"
            priority
          />

          <span className="text-muted-foreground text-sm">
            o la agencia de tu preferencia
          </span>
        </div>

        <p className="text-lg font-semibold text-foreground">S/ 19.00</p>
        <p className="text-sm text-muted-foreground">
          Costo fijo hacia cualquier región del país.
        </p>
      </section>

      {/* NOTAS */}
      <div className="mt-10 text-xs text-muted-foreground">
        <p>• El tiempo de entrega varía según la zona y empresa de transporte.</p>
        <p>• Para provincia, el tiempo lo define la agencia elegida.</p>
      </div>
    </main>
  );
}
