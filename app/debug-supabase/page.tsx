// app/debug-supabase/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.from('test').select('id').limit(1)

  return (
    <div style={{ padding: 24 }}>
      <h2>Debug Supabase</h2>
      <pre>data: {JSON.stringify(data, null, 2)}</pre>
      <pre>error: {JSON.stringify(error, null, 2)}</pre>
    </div>
  )
}
