'use server'

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

export async function loginAction(email: string, password: string): Promise<{ error: string } | void> {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) return { error: error?.message ?? 'Error al iniciar sesión' }

  // Use same authenticated client — RLS "user reads own profile" allows this
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile?.role) {
    return { error: `Sin perfil: ${profileError?.message ?? 'fila no encontrada'}` }
  }

  redirect(ROLE_HOME[profile.role as UserRole])
}
