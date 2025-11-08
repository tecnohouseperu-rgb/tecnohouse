// lib/supabase/rsc.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createRSCClient() {
  const cookieStore = cookies(); // read-only en RSC

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // En RSC solo podemos leer
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Para cumplir tipos, damos no-ops que avisen si alguien los usa aquí
        set() {
          console.warn("cookies.set() no está disponible en RSC.");
        },
        remove() {
          console.warn("cookies.remove() no está disponible en RSC.");
        },
      },
    }
  );
}
