import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { UserRole } from '@/types/database'

const ROLE_HOME: Record<UserRole, string> = {
  owner:   '/dashboard/owner',
  waiter:  '/dashboard/waiter',
  kitchen: '/dashboard/kitchen',
  bar:     '/dashboard/bar',
}

export default async function RootPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role as UserRole | undefined
  redirect(role ? ROLE_HOME[role] : '/login')
}
