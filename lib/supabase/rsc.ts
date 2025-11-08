// lib/supabase/rsc.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createSupabaseRSC() {
  const cookieStore = await cookies(); // <- IMPORTANTE

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // En RSC no podemos mutar cookies; provéemos no-ops para cumplir tipos
        set() {},
        delete() {},
      },
    }
  );
}
