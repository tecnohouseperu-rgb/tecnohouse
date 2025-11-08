// app/debug-supabase/page.tsx
import { createSupabaseRSC } from "@/lib/supabase/rsc";

export default async function Page() {
  const supabase = await createSupabaseRSC();

  const { data, error } = await supabase.from("tu_tabla").select("*").limit(1);
  return (
    <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
  );
}
