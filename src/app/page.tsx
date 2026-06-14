import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database'

const ROLE_HOME: Record<UserRole, string> = {
  owner:   '/dashboard/owner',
  waiter:  '/dashboard/waiter',
  kitchen: '/dashboard/kitchen',
  bar:     '/dashboard/bar',
}

export default async function RootPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(profile?.role ? ROLE_HOME[profile.role] : '/login')
}
