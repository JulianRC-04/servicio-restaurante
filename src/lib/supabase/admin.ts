import { createClient } from '@supabase/supabase-js'
import type { Database, UserRole } from '@/types/database'

// Service role client — bypasses RLS. Only use in server-side code (never in middleware/Edge).
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getUserProfile(userId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('user_profiles')
    .select('role, full_name, restaurant_id')
    .eq('id', userId)
    .single()
  return data as { role: UserRole; full_name: string | null; restaurant_id: string | null } | null
}
