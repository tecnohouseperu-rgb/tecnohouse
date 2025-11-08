// app/debug-supabase/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = createSupabaseServer();

  // Cambia 'test' por una tabla real en tu proyecto (por ej. 'products')
  const { data, error } = await supabase.from("test").select("*").limit(1);

  return (
    <main className="p-6">
      <h1>Debug Supabase</h1>
      {error ? (
        <p>Conectado a Supabase, pero: {error.message}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </main>
  );
}
