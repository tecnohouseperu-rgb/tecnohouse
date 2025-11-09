"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Clock4,
} from "lucide-react";

/** Icono TikTok hecho a mano (porque lucide-react no lo incluye) */
function TikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 448 512" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M448,209.9c-17.8,0-35.5-3.5-52-10.4c-15.9-6.7-30.2-16.3-42.6-28.3v135.5c0,112.5-91.2,203.3-203.7,203.3
        C91.2,510,0,419.2,0,306.7S91.2,103.4,203.7,103.4c5.1,0,10.2,0.2,15.2,0.6v83.7c-5-0.8-10.1-1.2-15.2-1.2
        c-65.9,0-119.3,53.2-119.3,119.1s53.4,119.1,119.3,119.1s119.3-53.2,119.3-119.1V0h83.9c5.6,42.4,37.3,77.5,79.1,87.9V209.9z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-200 mt-16">
      {/* Cuerpo principal */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Contacto */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contáctanos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-neutral-400" />
              <Link
                href="https://wa.me/51902138542"
                className="hover:text-white transition-colors"
                target="_blank"
              >
                Atención por Whatsapp
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Clock4 className="size-4 text-neutral-400" />
              Lun - Sab 9:00 am a 6:00 pm
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-neutral-400" />
              <Link
                href="mailto:servicioalcliente@tecnohouseperu.com"
                className="hover:text-white transition-colors"
              >
                servicioalcliente@tecnohouseperu.com
              </Link>
            </li>
          </ul>

          {/* Social */}
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              target="_blank"
            >
              <Facebook className="size-4" />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              target="_blank"
            >
              <Instagram className="size-4" />
            </Link>
            <Link
              href="https://youtube.com"
              aria-label="YouTube"
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              target="_blank"
            >
              <Youtube className="size-4" />
            </Link>
            <Link
              href="https://tiktok.com"
              aria-label="TikTok"
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              target="_blank"
            >
              <TikTok className="size-4" />
            </Link>
          </div>
        </div>

        {/* Sobre nosotros */}
        <div>
          <h3 className="text-white font-semibold mb-4">Sobre nosotros</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/quienes-somos" className="hover:text-white">
                ¿Quiénes somos?
              </Link>
            </li>
            <li>
              <Link href="/canales-de-atencion" className="hover:text-white">
                Canales de atención
              </Link>
            </li>
            <li>
              <Link href="/compra-segura" className="hover:text-white">
                Compra fácil y seguro
              </Link>
            </li>
            <li>
              <Link href="/metodos-de-pago" className="hover:text-white">
                Métodos de pago
              </Link>
            </li>
          </ul>
        </div>

        {/* Te informamos */}
        <div>
          <h3 className="text-white font-semibold mb-4">Te informamos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tiendas" className="hover:text-white">
                Nuestras tiendas
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:text-white">
                Cobertura de delivery
              </Link>
            </li>
            <li>
              <Link href="/garantia" className="hover:text-white">
                Certificado de garantía
              </Link>
            </li>
            <li>
              <Link href="/bases-legales" className="hover:text-white">
                Bases legales
              </Link>
            </li>
            <li>
              <Link href="/terminos-y-condiciones" className="hover:text-white">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/politicas-de-privacidad" className="hover:text-white">
                Políticas de privacidad
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-white">
                Políticas de uso de cookies
              </Link>
            </li>
            <li>
              <Link href="/cambios-y-devoluciones" className="hover:text-white">
                Políticas de cambios y devoluciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Destacado / espacio libre por si luego agregas algo */}
        <div>
          <h3 className="text-white font-semibold mb-4">Destacados</h3>
          <p className="text-sm text-neutral-400">
            Envio gratis a todo el Perú por compras mayores a S/ 200 .
          </p>
        </div>
      </div>

      {/* Franja métodos de pago */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col gap-4">
          <p className="text-sm text-neutral-400">Realiza tus compras de forma segura</p>

          {/* Si agregas logos en /public/payments, se verán. Dejé también chips por si no tienes imágenes aún */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Chips (fallback visible siempre) */}
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              Visa
            </span>
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              MasterCard
            </span>
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              American Express
            </span>
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              Yape
            </span>
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              PagoEfectivo
            </span>
            <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 text-xs">
              Mercado Pago
            </span>

            {/* Ejemplo con imágenes (opcional, cuando las subas a /public/payments/...) */}
            {/* 
            <Image src="/payments/visa.svg" alt="Visa" width={44} height={28} />
            <Image src="/payments/mastercard.svg" alt="MasterCard" width={44} height={28} />
            <Image src="/payments/yape.svg" alt="Yape" width={44} height={28} />
            <Image src="/payments/pagoefectivo.svg" alt="PagoEfectivo" width={44} height={28} />
            <Image src="/payments/mercadopago.svg" alt="Mercado Pago" width={44} height={28} />
            */}
          </div>
        </div>
      </div>

      {/* Pie inferior */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 text-xs text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} TecnoHouse Perú. Todos los derechos reservados.</span>
          <div className="flex gap-4">
                        <Link href="/tiendas" className="hover:text-neutral-200">
              Nuestras tiendas
            </Link>
            <Link href="/canales-de-atencion" className="hover:text-neutral-200">
              Canales de atención
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
