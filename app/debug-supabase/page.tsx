import { createSupabaseServer } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.from("test").select("*");

  return <pre>{error ? error.message : JSON.stringify(data, null, 2)}</pre>;
}
