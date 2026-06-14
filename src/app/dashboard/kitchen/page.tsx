import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function KitchenDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Pantalla cocina</h1>
          <p className="text-sm text-gray-400 mt-0.5">{profile?.full_name}</p>
        </div>
        <LogoutButton />
      </header>

      <p className="text-gray-400">Los pedidos entrantes aparecerán aquí en tiempo real.</p>

      <div className="mt-6 rounded-xl bg-gray-900 border border-gray-800 p-8 text-center text-gray-500">
        Sin pedidos pendientes
      </div>
    </main>
  )
}
