import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from '@/types/database'

const ROLE_HOME: Record<UserRole, string> = {
  owner:   '/dashboard/owner',
  waiter:  '/dashboard/waiter',
  kitchen: '/dashboard/kitchen',
  bar:     '/dashboard/bar',
}

const PROTECTED_PREFIXES = ['/dashboard']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from /login to their role home
  if (pathname === '/login' && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      return NextResponse.redirect(new URL(ROLE_HOME[profile.role], request.url))
    }
  }

  // Guard: user can only access their own role's dashboard
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      const allowed = ROLE_HOME[profile.role]
      if (!pathname.startsWith(allowed)) {
        return NextResponse.redirect(new URL(allowed, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
