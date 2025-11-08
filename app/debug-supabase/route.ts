import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const supabase = supabaseServer()

  // Ajusta el nombre de tu tabla
  const { data, error } = await supabase.from('test').select('*').limit(1)

  return NextResponse.json({ data, error })
}
