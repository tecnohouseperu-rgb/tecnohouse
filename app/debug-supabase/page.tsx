// app/debug-supabase/page.tsx
import { createRSCClient } from "@/lib/supabase/rsc";

export default async function DebugSupabasePage() {
  const supabase = createRSCClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Debug Supabase</h1>
      {error ? (
        <p>Conectado a Supabase, pero: {error.message}</p>
      ) : (
        <pre className="text-sm bg-gray-100 p-4 rounded">
          {JSON.stringify(user ?? { status: "OK (no user signed in)" }, null, 2)}
        </pre>
      )}
    </main>
  );
}
