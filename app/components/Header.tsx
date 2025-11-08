"use client";

import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">TecnoHouse Perú</Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem><Link href="/productos" className="px-4 py-2 hover:text-blue-600">Productos</Link></NavigationMenuItem>
            <NavigationMenuItem><Link href="/categorias" className="px-4 py-2 hover:text-blue-600">Categorías</Link></NavigationMenuItem>
            <NavigationMenuItem><Link href="/ofertas" className="px-4 py-2 hover:text-blue-600">Ofertas</Link></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ShoppingCart /></Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="outline"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-6 text-lg">
                <Link href="/productos">Productos</Link>
                <Link href="/categorias">Categorías</Link>
                <Link href="/ofertas">Ofertas</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
