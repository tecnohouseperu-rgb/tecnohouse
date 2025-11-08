import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function supabaseServer() {
  const cookieStore = cookies()

  // En RSC (pages/layout), cookies() es READONLY: get funciona, set/remove solo
  // funcionarán en Route Handlers o Server Actions (cookies "mutable").
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Estas 2 solo hacen efecto en Server Actions o Route Handlers:
        set(name: string, value: string, options: CookieOptions) {
          try {
            // En RSC no es mutable; en acciones/handlers sí.
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch {}
        },
      },
    }
  )
}
