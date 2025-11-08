// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // En Next 16 (RSC) cookies() es ASYNC. @supabase/ssr >=0.5
  // acepta una función que devuelva cookies() (Promise<ReadonlyRequestCookies>).
  return createServerClient(url, anon, {
    cookies, // <-- pásale la función importada, NO la ejecutes aquí
  })
}
