// lib/supabase/rsc.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseRSC() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 👇 En esta versión se pasa una función, no { get, set, remove }
      cookies: () => cookieStore,
    }
  );
}
