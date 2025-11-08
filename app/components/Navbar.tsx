"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg"
            alt="TecnoHouse Perú"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* MENÚ PC */}
        <nav className="hidden md:flex items-center gap-6 text-gray-800 font-medium">
          <Link href="/productos" className="hover:text-red-600">Productos</Link>
          <Link href="/categorias" className="hover:text-red-600">Categorías</Link>
          <Link href="/ofertas" className="hover:text-red-600">Ofertas</Link>
        </nav>

        {/* ICONOS DERECHA */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <Link href="/carrito" className="p-2 rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="22" height="22" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>

          {/* MENU MOBILE */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
}
