// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";

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
        {/* Banner profesional fijo arriba */}
        <TopBanner
          items={[
            {
              id: "free-shipping",
              text: 'En compras desde <b>S/ 200</b> a <b>Lima y todo el Perú</b>.',
            },
          ]}
          bgClass="bg-[#0B1220]"   // tono oscuro elegante
          textClass="text-white"
          emoji="🚚"
        />

        {/* Header sticky justo debajo del banner */}
        <Header />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
