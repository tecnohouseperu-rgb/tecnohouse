// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // PIDE cookies() DENTRO de la función (por request)
  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value ?? null
      },
      // OJO: set/delete sólo funcionan en Route Handlers o Server Actions
      set(name: string, value: string, options?: CookieOptions) {
        cookies().set(name, value, options)
      },
      delete(name: string, options?: CookieOptions) {
        // En Next 16 existe delete; si prefieres, puedes usar set con expires pasado
        cookies().delete?.(name, options as any)
      },
    },
  })

  return supabase
}
