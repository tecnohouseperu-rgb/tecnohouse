// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";
import { CartProvider } from "./components/cart-provider";
import CartToast from "./components/CartToast";
import { NavidadBanner } from "./components/NavidadBanner"; // 🎄 NUEVO

import Script from "next/script"; // 👈 IMPORTANTE

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TecnoHouse Perú",
  description: "Tienda de tecnología: audio, gamer, cómputo y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Pixel de Meta: solo en producción si quieres */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
            >{`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '26156644683922160');
              fbq('track', 'PageView');
            `}
            </Script>

            {/* Noscript para navegadores sin JS */}
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=26156644683922160&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
          </>
        )}

        <CartProvider>
          {/* Banner navideño flotante (solo 24 y 25) */}
          <NavidadBanner />

          {/* Toast global del carrito */}
          <CartToast />

          {/* Banner profesional fijo arriba */}
          <TopBanner
            items={[
              {
                id: "free-shipping",
                text: 'Envio gratis en compras desde <b>S/ 200</b> a <b>Lima y todo el Perú</b>.',
              },
            ]}
            bgClass="bg-[#0B1220]"
            textClass="text-white"
            emoji="🚚"
          />

          {/* Header sticky justo debajo del banner */}
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
