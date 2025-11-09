// app/metodos-de-pago/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Métodos de Pago | TecnoHouse Perú",
  description: "Elige cómo pagar: tarjeta, débito, PagoEfectivo y billeteras digitales.",
  alternates: { canonical: "/metodos-de-pago" },
};

function Card({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col">
      <p className="text-lg font-semibold">{title}</p>
      <div className="mt-2 text-sm text-muted-foreground flex-1">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

function BrandRow({
  brands,
}: {
  brands: { src: string; alt: string; w?: number; h?: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {brands.map((b, i) => (
        <Image
          key={i}
          src={b.src}
          alt={b.alt}
          width={b.w ?? 44}
          height={b.h ?? 24}
          className="object-contain"
        />
      ))}
    </div>
  );
}

export default function MetodosPagoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Métodos de pago
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Elige el medio que prefieras. Todos los pagos son verificados y seguros.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Tarjeta de Crédito */}
        <Card title="Tarjeta de Crédito"
          footer={
            <BrandRow
              brands={[
                { src: "/payments/visa.svg", alt: "Visa" },
                { src: "/payments/mastercard.svg", alt: "Mastercard" },
                { src: "/payments/amex.svg", alt: "Amex" },
                { src: "/payments/diners.svg", alt: "Diners" },
              ]}
            />
          }
        >
          Realiza pagos cómodos y seguros con tu tarjeta de crédito. Verifica el
          CVV dinámico si tu banco lo solicita.
        </Card>

        {/* Tarjeta de Débito */}
        <Card title="Tarjeta de Débito"
          footer={
            <BrandRow
              brands={[
                { src: "/payments/visa.svg", alt: "Visa" },
                { src: "/payments/mastercard.svg", alt: "Mastercard" },
              ]}
            />
          }
        >
          Paga directamente desde tu cuenta bancaria. Disponible para tarjetas
          con compras por internet habilitadas.
        </Card>

        {/* PagoEfectivo */}
        <Card title="PagoEfectivo"
          footer={
            <BrandRow
              brands={[
                { src: "/payments/pagoefectivo.svg", alt: "PagoEfectivo", w: 100, h: 28 },
              ]}
            />
          }
        >
          Paga con CIP mediante depósito en ventanilla o transferencia. Tienes
          hasta 8 horas para realizar el pago desde que generas el código.
        </Card>

        {/* Billeteras Digitales */}
        <Card title="Billeteras Digitales"
          footer={
            <BrandRow
              brands={[
                { src: "/payments/yape.svg", alt: "Yape" },
                { src: "/payments/plin.svg", alt: "Plin" },
                { src: "/payments/lukita.svg", alt: "Lukita" },
                { src: "/payments/niubiz.svg", alt: "Niubiz" },
              ]}
            />
          }
        >
          Paga rápido y seguro escaneando el QR desde la app de tu banco
          preferido. Confirma y listo.
        </Card>
      </div>

      {/* Nota legal breve */}
      <p className="mt-6 text-xs text-muted-foreground">
        * La disponibilidad de métodos de pago puede variar
        según la categoría o promociones activas.
      </p>
    </main>
  );
}
